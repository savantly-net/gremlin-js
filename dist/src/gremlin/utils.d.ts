export declare function assertNotEmpty(obj: any, msg?: string): void;
/**
 * Given optional and polymorphic arguments, return an object with a raw
 * 'gremlin' string and optional 'bindings' object.
 * When supplying a query object as first parameter, any bindings supplied
 * as the last parameter will be shallow-merged.
 *
 */
export declare function buildQueryFromSignature(rawScript: any, rawBindings: any): {
    gremlin: any;
    bindings: any;
};
