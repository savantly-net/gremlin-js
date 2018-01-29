import {GremlinClientOptions} from './gremlin-client-options';
import { GremlinQueryResponse } from './gremlin.query.response';
import { Guid } from './guid';
export class GremlinQuery {
  private lastResponse: GremlinQueryResponse;
  results: string[] = [];
  id = Guid.random();
  onComplete: (data: GremlinQueryResponse) => any;

  onMessage(data: GremlinQueryResponse) {
    if (null === data && this.lastResponse == null && this.onComplete !== null) {
      this.onComplete(null);
    } else {
      console.log(data);
      if (null === data && this.onComplete !== null) {
        this.lastResponse.rawMessage = this.results.join();
        this.onComplete(this.lastResponse);
      } else {
        this.lastResponse = data;
        this.results.push(data.rawMessage);
      }
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
