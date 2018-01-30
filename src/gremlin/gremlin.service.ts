import * as _ from 'lodash';

import { ChannelType, GremlinClientOptions } from './gremlin.client.options';
import { IGremlinConnection } from './gremlin.connection.interface';
import { GremlinEvent } from './gremlin.event';
import { GremlinQuery } from './gremlin.query';
import { GremlinQueryResponse } from './gremlin.query.response';
import { GremlinWebSocket } from './gremlin.web.socket';
import { Guid } from './guid';

export class GremlinService {
  connection: IGremlinConnection;
  sessionId = Guid.random();

  createConnection() {
    if (this.options.channelType === ChannelType.websocket) {
      this.connection = new GremlinWebSocket(this.options);
    } else {
      console.error('only websocket channel is supported at this time');
    }
    return this.connection;
  }

  createQuery(gremlin: string, bindings: any = {}): GremlinQuery {
    const query = new GremlinQuery(gremlin, bindings, this.options);
    return query;
  }

  sendMessage(query: GremlinQuery) {
    if (!this.connection) {
      this.createConnection();
    }
    return this.connection.execute(query);
  }

  constructor(private options: GremlinClientOptions) { }
}
