'use strict'

const faker = require('faker');

const generateProduct = (userContext, events, done) => {
  const product_name = faker.commerce.productName();
  const product_description = faker.lorem.sentence();
  const product_image = faker.image.imageUrl();
  const category = faker.commerce.department();
  const price = faker.commerce.price();
  const inventory_count = Math.floor(Math.random() * 10000);

  userContext.vars.product_name = product_name;
  userContext.vars.product_description = product_description;
  userContext.vars.product_image = product_name;
  userContext.vars.category = category;
  userContext.vars.price = price;
  userContext.vars.inventory_count = inventory_count;

  return done();
}

const getQuery = (userContext, events, done) => {
  const products = ['hat', 'towels', 'shirt', 'tuna', 'table', 'bike', 'hat', 'bacon', 'ball', 'soap', 'computer', 'salad', 'keyboard', 'pizza'];

  userContext.vars.query = products[Math.floor(Math.random() * products.length)];

  return done();
}

const getId = (userContext, events, done) => {
  const randomId = Math.floor(Math.random() * 2000000);

  userContext.vars.id = randomId;

  return done();
};

const restockProduct = (userContext, events, done) => {
  const randomId = Math.floor(Math.random() * 2000000);
  const randomQuantity = Math.floor(Math.random() * 10000);

  userContext.vars.restockId = randomId;
  userContext.vars.restockQuantity = randomQuantity;

  return done();
};

const processPurchase = (userContext, events, done) => {
  const randomId = Math.floor(Math.random() * 2000000);
  const randomQuantity = Math.floor(Math.random() * 10000);

  userContext.vars.purchaseId = randomId;
  userContext.vars.purchaseQuantity = randomQuantity;

  return done();
};

module.exports = {
  generateProduct,
  getQuery,
  getId,
  restockProduct,
  processPurchase,
};
