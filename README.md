# gremlin-js
Javascript client for a gremlin server


### Usage 

Script tag -

	<script type="text/javascript" src="gremlin.umd.js"></script>

npm/yarn -	

	npm install @savantly/gremlin-js
	


### Example

	var options = new gremlinjs.GremlinClientOptions();
	var service = new gremlinjs.GremlinService(options);
	
	var query = service.createQuery('g.V().limit(50).values()');
	
	query.onComplete = function(response) {
		console.log(response);
		$('#results').text(JSON.stringify(response.data));
	}
			
			
Or custom options -  

	var service = new gremlinjs.GremlinService({host: 'localhost', port: 8182'});   
			
Full list of client options [with defaults]- 

	port = 8182
	host = 'localhost'
	path = '/gremlin'
	language = 'gremlin-groovy'
	useSession = true
	ssl = false
	rejectUnauthorized = true
	accept = 'application/json'
	processor = ''
	channelType = 'websocket'
	
	user: empty;
	password: empty;
