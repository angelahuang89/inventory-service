const should = require('chai').should();
const expect = require('chai').expect;
const supertest = require('supertest');
const api = supertest('http://localhost:1337');
const request = require('request');
const Sequelize = require('sequelize');
// const db = require('../database/postgres.js');
// const dataGenerator = require('../database/dataGenerator.js');

describe('Server', () => {

  describe('Options', () => {
    it('should return options', () => {
      api.options('/')
      expect('GET,POST,PUT,PATCH,GET');
    });
  });

  describe('Client Search', () => {
    it('should return a 200 response', () => {
      api.get('/client/search')
      .set('Accept', 'application/json')
      expect(200);
    });
  });

  describe('New Products', () => {
    it('should add new products to inventory', () => {
      api.post('/products/new')
      .set('Accept', 'application/json')
      expect(200);
    });
  });

});

// describe('Database', function() {
//
//   const dbConnection = '';
//
//   beforeEach(function(done) {
//     dbConnection = new Sequelize('test', 'postgres', 'password', {
//       host: 'localhost',
//       dialect: 'postgres',
//       protocol: 'postgres',
//       logging: false,
//       dialectOptions: { ssl: true },
//   });
//
//   dbConnection.authenticate()
//     .then(() => console.log('Test connection established'))
//     .catch(err => console.error('Connection error'));
//
//   const table = 'testInventory';
//
//   afterEach(function() {
//     dbConnection.close();
//   });
//
//   it('should exist', function(done) {
//     expect(db.inventories, done);
//   });
// });
//
// describe('Data generator',function() {
//   it('should generate data', function() {
//     dataGenerator.createProducts()
//     expect('hello', done);
//   })
// });
