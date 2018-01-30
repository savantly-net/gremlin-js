import * as _ from 'lodash';

// Breaking change in TinkerPop v3.2.2, connect to /gremlin rather than /
// See: https://groups.google.com/d/topic/gremlin-users/x4hiHsmTsHM/discussion

export enum ChannelType {
  websocket = 'websocket',
  rest = 'rest'
}

export class GremlinClientOptions {
  port = 8182;
  host = 'localhost';
  path = '/gremlin';
  language = 'gremlin-groovy';
  useSession = true;
  ssl = false;
  rejectUnauthorized = true;
  accept = 'application/json';
  processor = '';
  channelType: ChannelType = ChannelType.websocket;

  user: string;
  password: string;

  setPath(path) {
    this.path = path && path.length && !path.startsWith('/') ? `/${path}` : path;
  }

  constructor(options?: any) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
