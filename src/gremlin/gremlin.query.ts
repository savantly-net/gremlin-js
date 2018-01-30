import {GremlinClientOptions} from './gremlin-client-options';
import { GremlinQueryResponse } from './gremlin.query.response';
import { Guid } from './guid';
export class GremlinQuery {
  private lastResponse: GremlinQueryResponse;
  results: any[] = [];
  id = Guid.random();
  onComplete: (data: GremlinQueryResponse) => any;

  addResults(data: any[]) {
    for (const item of data) {
      this.results.push(item);
    }
  }

  onMessage(response: GremlinQueryResponse) {
    const hasCallback = (this.onComplete !== undefined && this.onComplete !== null);
    const emptyResponse = null === response;
    const hasLastResponse = (this.lastResponse !== undefined && this.lastResponse !== null);

    if (!emptyResponse) {
      this.addResults(response.rawMessage.result.data);
      this.lastResponse = response;
    }

    if (emptyResponse && hasCallback && !hasLastResponse) {
      this.onComplete(null);
    } else if (emptyResponse && hasCallback && hasLastResponse) {
      this.lastResponse.data = this.results;
      this.onComplete(this.lastResponse);
    }
  }

   /*
   * returns a binary format ready for web-socket transfer
   */
  binaryFormat() {
    const serializedMessage = this.options.accept + this.jsonFormat();
    // serializedMessage = decodeURI(encodeURIComponent(serializedMessage));

    // Let's start packing the message into binary
    // mimeLength(1) + mimeType Length + serializedMessage Length
    const binaryMessage = new Uint8Array(1 + serializedMessage.length);
    binaryMessage[0] = this.options.accept.length;

    for (let i = 0; i < serializedMessage.length; i++) {
      binaryMessage[i + 1] = serializedMessage.charCodeAt(i);
    }

    return binaryMessage;
  }

  /**
   * returns a serialized json message ready for transfer
   */
  jsonFormat() {
    const msg = {
      requestId: this.id,
      op: this.options.op,
      processor: this.options.processor,
      args: {
        gremlin: this.rawQuery,
        bindings: {}, // TODO: parse raw query into bindings
        language: this.options.language
      }
    }
    const serializedMessage = JSON.stringify(msg);
    console.log('serializing request');
    console.log(msg);
    console.log('serialized request');
    console.log(serializedMessage);
    return serializedMessage;
  }

  constructor(private rawQuery: string, private options: GremlinClientOptions) {}

}
