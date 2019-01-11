// Breaking change in TinkerPop v3.2.2, connect to /gremlin rather than /
// See: https://groups.google.com/d/topic/gremlin-users/x4hiHsmTsHM/discussion
export var ChannelType;
(function (ChannelType) {
    ChannelType["websocket"] = "websocket";
    ChannelType["rest"] = "rest";
})(ChannelType || (ChannelType = {}));
export class GremlinClientOptions {
    constructor(options) {
        this.port = 8182;
        this.host = 'localhost';
        this.path = '/gremlin';
        this.language = 'gremlin-groovy';
        this.useSession = true;
        this.ssl = false;
        this.rejectUnauthorized = true;
        this.accept = 'application/json';
        this.processor = '';
        this.channelType = ChannelType.websocket;
        if (options) {
            Object.assign(this, options);
        }
    }
    setPath(path) {
        this.path = path && path.length && !path.startsWith('/') ? `/${path}` : path;
    }
}
//# sourceMappingURL=gremlin.client.options.js.map