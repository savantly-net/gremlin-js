import { Graphson } from './graphson';
import { GremlinClientOptions } from './gremlin.client.options';
import { IGremlinConnection } from './gremlin.connection.interface';
import { GremlinQuery } from './gremlin.query';
import { GremlinQueryOperation } from './gremlin.query.operation';
export declare class GremlinWebSocket implements IGremlinConnection {
    private options;
    private _ws;
    private _queries;
    private _queue;
    private maxReconnects;
    private reconnectAttempts;
    isOpen(): boolean;
    execute(gremlinQuery: GremlinQuery): void;
    sendBinaryMessage(binaryData: Uint8Array): void;
    /**
     * Process the current command queue, sending commands to Gremlin Server
     * (First In, First Out).
     */
    executeQueue(): void;
    cancelPendingCommands({message, details}: {
        message: any;
        details: any;
    }): void;
    arrayBufferToString(buffer: any): string;
    onMessage(message: any): void;
    onClose(evt: any): void;
    reconnect(): void;
    onOpen(evt: any): void;
    onError(err: any): void;
    buildChallengeResponse(query: GremlinQuery): Graphson;
    queryToGraphson(query: GremlinQuery, operation: GremlinQueryOperation): Graphson;
    graphsonToBinary(query: Graphson): Uint8Array;
    isConnecting(): boolean;
    open(): boolean;
    constructor(options: GremlinClientOptions);
}
