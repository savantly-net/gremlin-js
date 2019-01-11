import { GremlinQuery } from './gremlin.query';
export interface IGremlinConnection {
    execute(query: GremlinQuery): any;
}
