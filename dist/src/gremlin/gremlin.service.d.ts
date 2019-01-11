import { GremlinClientOptions } from './gremlin.client.options';
import { IGremlinConnection } from './gremlin.connection.interface';
import { GremlinQuery } from './gremlin.query';
export declare class GremlinService {
    private options;
    connection: IGremlinConnection;
    sessionId: string;
    createConnection(): IGremlinConnection;
    createQuery(gremlin: string, bindings?: any): GremlinQuery;
    sendMessage(query: GremlinQuery): any;
    constructor(options: GremlinClientOptions);
}
