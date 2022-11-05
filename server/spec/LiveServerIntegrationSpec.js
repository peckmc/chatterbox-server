var request = require('request');
var expect = require('chai').expect;
var handler = require('../request-handler');

describe('server', function() {

  it('Should answer OPTIONS requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should display methods for OPTIONS requests', function(done) {
    request({method: 'OPTIONS',
    uri: 'http://127.0.0.1:3000/classes/messages',
    }, function(error, response, body) {

      expect(response.statusCode).to.equal(200);
      expect(response.body).to.equal('Allow: GET, POST, OPTIONS');
      done();
    });
  });

  it('Should use CORS headers for all method types', function(done) {
    request({method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    }, function(error, response, body) {
      response.headers['access-control-max-age'] = JSON.parse(response.headers['access-control-max-age']);
      expect(response.headers).to.include(handler.defaultCorsHeaders);

    });

    request({method: 'GET',
    uri: 'http://127.0.0.1:3000/classes/messages',
    }, function(error, response, body) {
      response.headers['access-control-max-age'] = JSON.parse(response.headers['access-control-max-age']);
      expect(response.headers).to.include(handler.defaultCorsHeaders);
    });

    request({method: 'OPTIONS',
    uri: 'http://127.0.0.1:3000/classes/messages',
    }, function(error, response, body) {
      response.headers['access-control-max-age'] = JSON.parse(response.headers['access-control-max-age']);
      expect(response.headers).to.include(handler.defaultCorsHeaders);
    });

    done();
  })

  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        // message_id: '',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body);
        expect(messages[0].username).to.equal('Jono');
        expect(messages[0].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });
});
