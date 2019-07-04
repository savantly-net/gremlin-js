import { Graphson } from './graphson';
import { GremlinQueryOperation } from './gremlin.query.operation';
import { Guid } from './guid';
export class GremlinQuery {
    constructor(gremlin, bindings, options) {
        this.gremlin = gremlin;
        this.bindings = bindings;
        this.options = options;
        this.results = [];
        this.id = Guid.random();
        this.op = 'eval';
    }
    addResults(data) {
        this.results.push(data);
    }
    onMessage(response) {
        const hasCallback = (this.onComplete !== undefined && this.onComplete !== null);
        const emptyResponse = null === response;
        const hasLastResponse = (this.lastResponse !== undefined && this.lastResponse !== null);
        if (!emptyResponse) {
            this.addResults(response.rawMessage.result.data);
            this.lastResponse = response;
        }
        if (emptyResponse && hasCallback && !hasLastResponse) {
            this.onComplete(null);
        }
        else if (emptyResponse && hasCallback && hasLastResponse) {
            this.lastResponse.data = this.results;
            this.onComplete(this.lastResponse);
        }
    }
    /**
     * returns a graphson formatted message
     */
    getGraphson(operation) {
        const saslbase64 = new Buffer('\0' + this.options.user + '\0' + this.options.password).toString('base64');
        let args;
        if (operation === GremlinQueryOperation.authentication) {
            args = { sasl: saslbase64 };
        }
        else {
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
        };
        return new Graphson(msg);
    }
}
//# sourceMappingURL=gremlin.query.js.map