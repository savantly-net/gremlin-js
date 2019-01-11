import * as _ from 'lodash';
export function assertNotEmpty(obj, msg = '') {
    if (obj === null || obj === undefined || obj.length === 0) {
        console.error('argument should not be empty: ' + msg);
    }
}
/**
 * Given optional and polymorphic arguments, return an object with a raw
 * 'gremlin' string and optional 'bindings' object.
 * When supplying a query object as first parameter, any bindings supplied
 * as the last parameter will be shallow-merged.
 *
 */
export function buildQueryFromSignature(rawScript = '', rawBindings) {
    const { gremlin = rawScript, bindings = rawBindings } = rawScript;
    return {
        gremlin,
        // Remap 'undefined' bindings as 'null' values that would otherwise
        // result in missing/unbound variables in the Gremlin script execution
        // context.
        bindings: _.mapValues(Object.assign({}, bindings, rawBindings), (value) => (_.isUndefined(value) ? null : value)),
    };
}
//# sourceMappingURL=utils.js.map