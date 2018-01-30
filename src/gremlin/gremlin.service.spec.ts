import { GremlinClientOptions } from './gremlin.client.options';
import { GremlinService } from './gremlin.service';
import {GremlinQuery} from './gremlin.query';
import { GremlinQueryResponse } from './gremlin.query.response';

let service: GremlinService;

describe('GremlinService', () => {
  beforeEach(() => {
    service = new GremlinService(new GremlinClientOptions());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a connection', () => {
    const connection = service.createConnection();
    expect(connection).toBeTruthy();
  });

  it('should execute a gremlin query', (done) => {
    const connection = service.createConnection();
    const query = service.createQuery('g.V()');
    query.onComplete = (response) => {
      console.log(response);
      done();
    };
    service.sendMessage(query);
  });
});
