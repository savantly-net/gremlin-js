import { GremlinClientOptions } from './gremlin-client-options';
import { GremlinWebSocket } from './gremlin-web-socket';
import { GremlinQueryResponse } from './gremlin.query.response';
export declare class GremlinService {
    options: GremlinClientOptions;
    connection: GremlinWebSocket;
    commands: {};
    queue: any[];
    sessionId: string;
    createConnection(options: GremlinClientOptions): GremlinWebSocket;
    closeConnection(): void;
    /**
     * Clear the queue after the connection is opened
     */
    onConnectionOpen(): void;
    /**
     * Process the current command queue, sending commands to Gremlin Server
     * (First In, First Out).
     */
    executeQueue(): void;
    cancelPendingCommands({message, details}: {
        message: any;
        details: any;
    }): void;
    sendMessage(message: string, callback?: (response: GremlinQueryResponse) => void): void;
    constructor();
}
