const faker = require('faker');
const Promise = require('bluebird');

const db = require('./postgres.js');

const generateInventory = () => {
  db.Inventory.sync()
    .then(() => {
      createProducts();
    })
    .catch(error => ('Error creating inventory table', error))
};

const createProducts = () => {
  let arr = [];
  for (let i = 0; i < 100000; i++) {
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
    .then(inventory => console.log('Created new products'))
    .catch(error => ('Error creating products', error));
}

generateInventory();
