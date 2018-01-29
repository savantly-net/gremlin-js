import * as _ from 'lodash';

import { GremlinClientOptions } from './gremlin-client-options';
import { GremlinWebSocket } from './gremlin-web-socket';
import { GremlinEvent } from './gremlin.event';
import { GremlinQuery } from './gremlin.query';
import { GremlinQueryResponse } from './gremlin.query.response';
import { Guid } from './guid';

export class GremlinService {
  options: GremlinClientOptions;
  connection: GremlinWebSocket;
  commands = {};
  queue = [];
  sessionId = Guid.random();

  createConnection(options: GremlinClientOptions) {
    this.options = options;
    this.connection = new GremlinWebSocket(options);

    return this.connection;
  }

  closeConnection() {
    this.connection.close();
  }

  /**
   * Clear the queue after the connection is opened
   */
  onConnectionOpen() {
    this.executeQueue();
  }

  /**
   * Process the current command queue, sending commands to Gremlin Server
   * (First In, First Out).
   */
  executeQueue() {
    while (this.queue.length > 0) {
      const {message} = this.queue.shift();
      this.sendMessage(message);
    }
  }

  cancelPendingCommands({message, details}) {
    const commands = this.commands;
    let command;
    const error = new Error(message);
    (error as any).details = details;

    // Empty queue
    this.queue.length = 0;
    this.commands = {};

    Object.keys(commands).forEach((key) => {
      command = commands[key];
      command.messageStream.emit('error', error);
    });
  }

  sendMessage(message: string, callback?: (response: GremlinQueryResponse) => void) {
    const query = new GremlinQuery(message, this.options);
    query.onComplete = callback;
    const sent = this.connection.sendMessage(query);
    if (!sent) {
      this.connection.open();
    }
  }

  constructor() { }
}
