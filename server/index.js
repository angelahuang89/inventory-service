const express = require('express');
const bluebird = require('bluebird');
const axios = require('axios');
const bodyParser = require('body-parser');
const db = require('../database/postgres');
const dataGenerator = require('../database/dataGenerator');
const cache = require('../cache/redis');
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
  cache.retrieveIds(params.query)
    .then(productIds => {
      return db.searchById(productIds);
    })
    .then(results => response.send(results))
    .catch(error => response.sendStatus(404));
  // db.searchForProducts(params.query)
  //   .then(results => response.send(results))
  //   .catch(error => response.sendStatus(404));
});

app.get('/client/search/:id', (request, response) => {
  const { params } = request;
  db.getProductInfo(params.id)
    .then(result => response.send(result))
    .catch(error => response.sendStatus(404));
});

app.post('/products/new', (request, response) => {
  // adds new products to inventory
  const { body } = request;
  db.addNewProduct(body)
    .then(results => {
      const { product_name, id } = results;
      cache.addProductToCache(product_name, id);
      clientSQS.sendNewProduct(results);
      bundleSQS.sendNewProduct(results);
      response.json(results);
    })
    .catch(error => response.sendStatus(404));
});

app.delete('/products/discontinued', (request, response) => {
  // remove discontinued products from inventory
  const { product_name, id  } = request.body;
  db.removeProducts(id)
    .then(() => {
      cache.removeFromCache(product_name, id);
      clientSQS.sendDiscontinued(id);
      bundleSQS.sendDiscontinued(id);
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
