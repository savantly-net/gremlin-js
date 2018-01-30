import { Graphson } from './graphson';
import { GremlinClientOptions } from './gremlin.client.options';
import { IGremlinConnection } from './gremlin.connection.interface';
import { GremlinEvent } from './gremlin.event';
import { GremlinQuery } from './gremlin.query';
import { GremlinQueryOperation } from './gremlin.query.operation';
import { GremlinQueryResponse } from './gremlin.query.response';
import { assertNotEmpty } from './utils';

export class GremlinWebSocket implements IGremlinConnection {
  private _ws: WebSocket;
  private _queries: {[id: string]: GremlinQuery} = {};
  private _queue = new Array<Graphson>();
  private maxReconnects = 30;
  private reconnectAttempts = 0;

  isOpen() {
    return this._ws && this._ws.OPEN === this._ws.readyState;
  }

  execute(gremlinQuery: GremlinQuery) {
    assertNotEmpty(gremlinQuery.id);
    this._queries[gremlinQuery.id] = gremlinQuery;
    const graphson = this.queryToGraphson(gremlinQuery, GremlinQueryOperation.eval);
    this._queue.push(graphson);
    if (this.isOpen()) {
      this.executeQueue();
    }
  }

  sendBinaryMessage(binaryData: Uint8Array) {
    this._ws.send(binaryData);
  }

  /**
   * Process the current command queue, sending commands to Gremlin Server
   * (First In, First Out).
   */
  executeQueue() {
    while (this._queue.length > 0) {
      const graphson = this._queue.shift();
      const binaryData = this.graphsonToBinary(graphson);
      this.sendBinaryMessage(binaryData);
    }
  }

  cancelPendingCommands({message, details}) {
    this._queue.length = 0;
    this._queries = {};
  }

  arrayBufferToString(buffer) {
    console.log('converting buffer to string');
    const bufView = new Uint8Array(buffer);
    const length = bufView.length;
    let result = '';
    let addition = Math.pow(2, 8) - 1;

    for (let i = 0; i < length; i += addition) {

        if (i + addition > length) {
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
    }
    console.log('extracted string from buffer: ' + result);
    return result;
}

  /*
  *  Process all incoming raw message events sent by Gremlin Server, and dispatch
  *  to the appropriate command.
  *
  */
  onMessage(message) {
    let rawMessage;
    let requestId;
    let statusCode;
    let statusMessage;

    console.log('web socket received message');

    try {
      const {data} = message;
      const rawMessageString = this.arrayBufferToString(data);
      rawMessage = JSON.parse(rawMessageString);
      requestId = rawMessage.requestId;
      statusCode = rawMessage.status.code;
      statusMessage = rawMessage.status.message;
    } catch (e) {
      console.warn('MalformedResponse', 'Received malformed response message');
      console.log(message);
      return;
    }

    const gremlinResponse = new GremlinQueryResponse();
    gremlinResponse.rawMessage = rawMessage;
    gremlinResponse.requestId = requestId;
    gremlinResponse.statusCode = statusCode;
    gremlinResponse.statusMessage = statusMessage;

    console.log('preparing to excecute callback for request');

    // If we didn't find a waiting query for this response, emit a warning
    if (!this._queries[requestId]) {
      console.warn(
        'OrphanedResponse',
        `Received response for missing or closed request: ${requestId}, status: ${statusCode}, ${statusMessage}`,
      );
      return;
    }

    const query = this._queries[requestId];

    switch (statusCode) {
      case 200: // SUCCESS
        delete this._queries[requestId]; // TODO: optimize performance
        query.onMessage(gremlinResponse);
        query.onMessage(null);
        break;
      case 204: // NO_CONTENT
        delete this._queries[requestId];
        query.onMessage(null);
        break;
      case 206: // PARTIAL_CONTENT
        query.onMessage(rawMessage);
        break;
      case 407: // AUTHENTICATE CHALLANGE
        const challengeResponse = this.buildChallengeResponse(query);
        this._queue.push(challengeResponse);
        this.executeQueue();
        break;
      default:
        delete this._queries[requestId];
        console.error(statusMessage + ' (Error ' + statusCode + ')');
        break;
    }
  }

  onClose(evt) {
    console.log('connection closed');
    if (this._queue.length > 0) {
      console.warn(`${this._queue.length} queries are queued`);
    }
    if (this.reconnectAttempts < this.maxReconnects && !this.open()) {
      this.reconnect();
    } else if (!this.open()) {
      console.warn('giving up reconnecting');
    } else {
      this.reconnectAttempts = 0;
    }
  }

  reconnect() {
    setTimeout(() => {
      console.log('reconnecting');
      this.onClose(null);
    }, 1000);
  }

  onOpen(evt) {
    console.log('opened connection');
    this.executeQueue();
  }

  onError(err) {
    console.log('an error occured');
    console.error(err);
  }

  buildChallengeResponse(query: GremlinQuery): Graphson {
    const {processor, accept, language } = this.options;
    const saslbase64 = new Buffer('\0' + this.options.user + '\0' + this.options.password).toString('base64');
    const args = {sasl: saslbase64}

    const message = {
      requestId: query.id,
      processor,
      op: GremlinQueryOperation.authentication,
      args,
    };
    const graphson = new Graphson(message);

    return graphson;
  }

  queryToGraphson(query: GremlinQuery, operation: GremlinQueryOperation) {
    console.log(`queryToGraphson: ${query.id}`);
    return query.getGraphson(operation);
  }

   /*
   * returns a binary format ready for web-socket transfer
   */
  graphsonToBinary(query: Graphson) {
    const serializedMessage = this.options.accept + JSON.stringify(query);

    // Let's start packing the message into binary
    // mimeLength(1) + mimeType Length + serializedMessage Length
    const binaryMessage = new Uint8Array(1 + serializedMessage.length);
    binaryMessage[0] = this.options.accept.length;

    for (let i = 0; i < serializedMessage.length; i++) {
      binaryMessage[i + 1] = serializedMessage.charCodeAt(i);
    }
    return binaryMessage;
  }

  isConnecting() {
    return this._ws && this._ws.readyState === this._ws.CONNECTING;
  }

  /*
   * return true if open or connecting
   */
  open() {
    if (this.isOpen() || this.isConnecting()) {
      return true;
    }
    const address = `ws${this.options.ssl ? 's' : ''}://${this.options.host}:${this.options.port}${this.options.path}`;
    this._ws = new WebSocket(address);
    this._ws.binaryType = 'arraybuffer';
    this._ws.onopen = (evt) => { this.onOpen(evt) };
    this._ws.onerror = (evt) => { this.onError(evt) };
    this._ws.onmessage = (evt) => { this.onMessage(evt) };
    this._ws.onclose = (evt) => { this.onClose(evt) };
    return false;
  }

  constructor(private options: GremlinClientOptions) {
    this.open();
  }
}
