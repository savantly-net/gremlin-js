import { Graphson } from './graphson';
import { GremlinClientOptions } from './gremlin.client.options';
import { GremlinQueryOperation } from './gremlin.query.operation';
import { GremlinQueryResponse } from './gremlin.query.response';
import { Guid } from './guid';

export class GremlinQuery {
  private lastResponse: GremlinQueryResponse;
  results: any[] = [];
  id = Guid.random();
  onComplete: (data: GremlinQueryResponse) => any;
  op = 'eval';
  aliases: string;

  addResults(data: any[]) {
    //for (const item of data) {
      this.results.push(data);
    //}
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

  /**
   * returns a graphson formatted message
   */
  getGraphson(operation: GremlinQueryOperation) {
    const saslbase64 = btoa('\0' + this.options.user + '\0' + this.options.password)
    let args;
    if (operation === GremlinQueryOperation.authentication) {
      args = {sasl: saslbase64};
    } else {
      args = {
        gremlin: this.gremlin,
        bindings: this.bindings || {},
        language: this.options.language
      };
    }
    const msg = {
      requestId: this.id,
      op: operation,
      processor: this.options.processor,
      args
    }
    return new Graphson(msg);
  }

  constructor(private gremlin: string, private bindings: any, private options: GremlinClientOptions) {}

}
