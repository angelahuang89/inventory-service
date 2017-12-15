const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:1337');

describe('Client Search', function() {
  it('should return a 200 response', function(done) {
    api.get('/client/search')
    .set('Accept', 'application/json')
    .expect(200, done);
  })
});
