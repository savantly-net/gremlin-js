import { GremlinClientOptions } from './gremlin-client-options';
import { GremlinQueryResponse } from './gremlin.query.response';
export declare class GremlinQuery {
    private rawQuery;
    private options;
    private lastResponse;
    results: string[];
    id: string;
    onComplete: (data: GremlinQueryResponse) => any;
    onMessage(data: GremlinQueryResponse): void;
    binaryFormat(): Uint8Array;
    /**
     * returns a serialized json message ready for transfer
     */
    jsonFormat(): string;
    constructor(rawQuery: string, options: GremlinClientOptions);
}
