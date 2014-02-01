var http = require('http');
var assert = require('assert');

describe('TNSFPG Error', function() {
  it('should show a 404 error on invalid routes', function(done) {
    http.get('http://localhost:3030/someinvalidroute', function(res) {
      assert.equal(res.statusCode, 404);
      done();
    });
  });
});
