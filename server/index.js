const express = require('express');
const bluebird = require('bluebird');
const axios = require('axios');
const db = require('../database/postgres.js');
const dataGenerator = require('../database/dataGenerator.js');
const bodyParser = require('body-parser');
const bundleSQS = require('../sqs/bundleSendSQS');
const clientSQS = require('../sqs/clientSendSQS');

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

app.get('/client/search/:id', (request, response) => {
  const { params } = request;
  db.getProductInfo(params.id)
    .then(result => response.send(result))
    .catch(error => response.sendStatus(404));
});

// post requests to /client/inventory and /bundles/inventory

// app.post('/client/inventory', (request, response) => {
  // send inventory information to client
// });

// app.post('/bundles/inventory', (request, response) => {
  // send inventory information to inventory
// });

app.post('/products/new', (request, response) => {
  // adds new products to inventory
  const { body } = request;
  db.addNewProduct(body)
    .then(results => {
      clientSQS.sendNewProduct(results.dataValues);
      bundleSQS.sendNewProduct(results.dataValues);
      response.json(results.dataValues);
    })
    .catch(error => response.sendStatus(404));
});

app.delete('/products/discontinued', (request, response) => {
  // remove discontinued products from inventory
  const { body } = request;
  db.removeProducts(body.productId)
    .then(() => {
      clientSQS.sendDiscontinued(body.productId);
      bundleSQS.sendDiscontinued(body.productId);
      response.sendStatus(204);
    })
    .catch(error => response.sendStatus(404));
});

app.patch('/products/restock', (request, response) => {
  // replenish products in inventory
  const { body } = request;
  db.restockProducts(body)
    .then(results => {
      clientSQS.sendRestock(results.dataValues);
      bundleSQS.sendRestock(results.dataValues);
      response.sendStatus(204);
    })
    .catch(error => response.sendStatus(404));
});

app.patch('/purchases', (request, response) => {
  // update inventory count from purchases using product ids
  const { body } = request;
  db.updateProductCounts(body)
    .then(results => {
      clientSQS.sendPurchase(results.dataValues);
      bundleSQS.sendPurchase(results.dataValues);
      response.sendStatus(204);
    })
    .catch(error => response.sendStatus(404));
});

const port = 1337;

app.listen(port, () => console.log(`listening on port ${port}`));
