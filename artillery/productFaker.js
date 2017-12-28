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

module.exports = {
  generateProduct
};
