const faker = require('faker');
const Promise = require('bluebird');

const db = require('./postgres.js');

const checkIfTableExists = () => {
  db.Inventory.sync()
    .catch(error => ('Error creating inventory table', error))
};

const createProducts = (number) => {
  let arr = [];
  for (let i = 0; i < number; i++) {
    let obj = {};
    obj.product_name = faker.commerce.productName();
    obj.product_description = faker.lorem.sentence();
    obj.product_image = faker.image.imageUrl();
    obj.category = faker.commerce.department();
    obj.price = faker.commerce.price();
    obj.inventory_count = Math.floor(Math.random() * 10000);
    arr.push(obj);
  }

  db.Inventory.bulkCreate(arr)
    .then(() => console.log('Created new products'))
    .catch(error => console.error('Error creating products', error));
}

// checkIfTableExists();
// createProducts(100000);

exports.checkIfTableExists = checkIfTableExists;
exports.createProducts = createProducts;
