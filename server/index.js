const express = require('express');
const bluebird = require('bluebird');
const axios = require('axios');
const db = require('../database/postgres.js');
const dataGenerator = require('../database/dataGenerator.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.options('/', (request, response) => response.json('GET,POST,PUT,PATCH,DELETE'));

// search database for products that match query
// return product results that match query
app.get('/client/search/:query', (request, response) => {
  const { params } = request;
  db.searchForProducts(params.query)
    .then(results => response.send(results))
    .catch(error => response.sendStatus(404));
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
  db.addNewProducts([{product_name:'hello'}, {product_name:'bye'}])
    .then(results => response.send(results))
    .catch(error => response.sendStatus(404));
  // send ids back
  // send to client and bundles
});

app.delete('/products/discontinued', (request, response) => {
  // remove discontinued products from inventory
  db.removeProducts(/* array of products */)
    .then(() => response.sendStatus(202))
    .catch(error => response.sendStatus(420204));
  // send product ids client and bundles
});

app.patch('/products/restock', (request, response) => {
  // replenish products in inventory
  // db.restockProducts
  response.sendStatus(204);
  // send product ids bundles and inventory
});

app.patch('/purchases', (request, response) => {
  // update inventory count from purchases using product ids
  // db.updateProductCounts
  response.sendStatus(204);
});

const port = 1337;

app.listen(port, () => console.log(`listening on port ${port}`));
