const express = require('express');
const db = require('../database/postgres.js');
const dataGenerator = require('../database/dataGenerator.js');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('/', (request, response) => response.json('GET,POST,PUT,PATCH,GET'));

app.get('/client/search/', (request, response) => {
  const { query } = request.query;
  // search database for products that match query
  // return product results that match query
});

// post requests to /client/inventory and /bundles/inventory

app.post('/client/inventory', (request, response) => {
  // send inventory information to client
});

app.post('/bundles/inventory', (request, response) => {
  // send inventory information to inventory
});

app.post('/products/new', (request, response) => {
  // adds new products to inventory  
});

app.patch('/products/discontinued', (request, response) => {
  // remove discontinued products from inventory
});

app.patch('/products/restock', (request, response) => {
  // replenish products in inventory
});

app.patch('/purchases', (request, response) => {
  // update inventory count from purchases
});

app.listen(port, () => console.log(`listening on port ${port}`));