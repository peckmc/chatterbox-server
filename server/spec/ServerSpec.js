var handler = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');

describe.only('Custom Tests', function() {
  it('Should answer OPTIONS requests for /classes/messages with a 200 status code', function() {
    var req = new stubs.request('/classes/messages', 'OPTIONS');
    var res = new stubs.response();
    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should display methods for OPTIONS requests', function() {
    var req = new stubs.request('/classes/messages', 'OPTIONS');
    var res = new stubs.response();
    handler.requestHandler(req, res);

    expect(res._data).to.equal('Allow: GET, POST, OPTIONS');
  });

  it('Should use CORS headers for all method types', function() {
    var postReq = new stubs.request('/classes/messages', 'POST', {
      username: 'Test User',
      text: 'Do my bidding!'
    });
    var getReq = new stubs.request('/classes/messages', 'GET');
    var optionsReq = new stubs.request('/classes/messages', 'OPTIONS');

    var postRes = new stubs.response();
    var getRes = new stubs.response();
    var optionsRes = new stubs.response();

    handler.requestHandler(postReq, postRes);
    handler.requestHandler(getReq, getRes);
    handler.requestHandler(optionsReq, optionsRes);

    expect(postRes._headers).to.include(handler.defaultCorsHeaders);
    expect(getRes._headers).to.include(handler.defaultCorsHeaders);
    expect(optionsRes._headers).to.include(handler.defaultCorsHeaders);
  })
});

describe('Node Server Request Listener Function', function() {
  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();
    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    // expect(res._data).to.equal(JSON.stringify('\n'));
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data);
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

});