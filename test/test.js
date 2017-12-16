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
    it('should return options \'GET,POST,PUT,PATCH,GET\'', () => {
      api.options('/')
      expect('GET,POST,PUT,PATCH,GET');
    });
  });

  describe('Client Search', () => {
    it('should return products matching search term', () => {
      api.get('/client/search')
      .set('Accept', 'application/json')
      expect(200);
    });
  });

  describe('New Products', () => {
    it('should add new products to inventory', () => {
      api.post('/products/new')
      .set('Accept', 'application/json')
      expect(201);
    });
  });

  describe('Discontinued Products', () => {
    it('should remove discontinued products to inventory', () => {
      api.delete('/products/discontinued')
      .set('Accept', 'application/json')
      expect(202);
    });
  });

  describe('Restock of Products', () => {
    it('should restock products in inventory', () => {
      api.patch('/products/restock')
      .set('Accept', 'application/json')
      expect(204);
    });
  });

  describe('Purchases', () => {
    it('should update inventory after purchases', () => {
      api.patch('/purchases')
      .set('Accept', 'application/json')
      expect(204);
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
