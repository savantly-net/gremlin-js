import { ChannelType } from './gremlin.client.options';
import { GremlinQuery } from './gremlin.query';
import { GremlinWebSocket } from './gremlin.web.socket';
import { Guid } from './guid';
export class GremlinService {
    constructor(options) {
        this.options = options;
        this.sessionId = Guid.random();
    }
    createConnection() {
        if (this.options.channelType === ChannelType.websocket) {
            this.connection = new GremlinWebSocket(this.options);
        }
        else {
            console.error('only websocket channel is supported at this time');
        }
        return this.connection;
    }
    createQuery(gremlin, bindings = {}) {
        const query = new GremlinQuery(gremlin, bindings, this.options);
        return query;
    }
    sendMessage(query) {
        if (!this.connection) {
            this.createConnection();
        }
        return this.connection.execute(query);
    }
}
//# sourceMappingURL=gremlin.service.js.map