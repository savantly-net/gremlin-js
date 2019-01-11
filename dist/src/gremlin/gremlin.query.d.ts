import { Graphson } from './graphson';
import { GremlinClientOptions } from './gremlin.client.options';
import { GremlinQueryOperation } from './gremlin.query.operation';
import { GremlinQueryResponse } from './gremlin.query.response';
export declare class GremlinQuery {
    private gremlin;
    private bindings;
    private options;
    private lastResponse;
    results: any[];
    id: string;
    onComplete: (data: GremlinQueryResponse) => any;
    op: string;
    aliases: string;
    addResults(data: any[]): void;
    onMessage(response: GremlinQueryResponse): void;
    /**
     * returns a graphson formatted message
     */
    getGraphson(operation: GremlinQueryOperation): Graphson;
    constructor(gremlin: string, bindings: any, options: GremlinClientOptions);
}
