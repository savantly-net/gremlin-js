import { GremlinClientOptions } from './gremlin-client-options';
import { GremlinQuery } from './gremlin.query';
export declare class GremlinWebSocket {
    private options;
    private _ws;
    private _queries;
    private _queue;
    socket(): WebSocket;
    close(): void;
    isOpen(): boolean;
    sendMessage(gremlinQuery: GremlinQuery): boolean;
    /**
     * Process the current command queue, sending commands to Gremlin Server
     * (First In, First Out).
     */
    executeQueue(): void;
    arrayBufferToString(buffer: any): string;
    onMessage(message: any): void;
    onOpen(evt: any): void;
    onError(err: any): void;
    buildChallengeResponse(requestId: any): {
        requestId: any;
        processor: string;
        op: string;
        args: {
            sasl: string;
        };
    };
    isConnecting(): boolean;
    open(): void;
    constructor(options: GremlinClientOptions);
}
