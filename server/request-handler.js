/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var messages = [];

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var headers = defaultCorsHeaders;

  if (request.url === '/classes/messages' && request.method === 'GET') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
  } else if(request.url === '/classes/messages' && request.method === 'POST') {
    headers['Content-Type'] = 'application/JSON';
    response.writeHead(201, headers);
    request.on('data', (chunk) => {
      messages.push(JSON.parse(chunk));
    });
    response.end();
  } else if (request.url === '/classes/messages' && request.method === 'OPTIONS') {
    headers['Accept'] = 'GET, POST, OPTIONS';
    response.writeHead(200, headers);
    response.end('Allow: GET, POST, OPTIONS');
  } else {
    response.writeHead(404);
    response.end('404 Page not found!');
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
module.exports.defaultCorsHeaders = defaultCorsHeaders;