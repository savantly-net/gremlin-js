import { GremlinClientOptions } from './gremlin-client-options';
import { GremlinService } from './gremlin.service';
import {GremlinQuery} from './gremlin.query';
import { GremlinQueryResponse } from './gremlin.query.response';

let service: GremlinService;

describe('GremlinService', () => {
  beforeEach(() => {
    service = new GremlinService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a connection', () => {
    const connection = service.createConnection(new GremlinClientOptions());
    expect(connection).toBeTruthy();
  });

  it('should execute a gremlin query', (done) => {
    const options = new GremlinClientOptions();
    const connection = service.createConnection(options);
    connection.open();
    service.sendMessage('g.V()', (response: GremlinQueryResponse) => {
      console.info('test info');
      console.log(response);
      expect(response).toBeTruthy();
      done();
    });
  });
});
