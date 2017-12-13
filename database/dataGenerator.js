const faker = require('faker');
const Promise = require('bluebird');

const db = require('./postgres.js');

db.db.sync({ force: true })
  .then(() => db.Inventory.sync())
  .catch(error => console.error('Error generating data', error));