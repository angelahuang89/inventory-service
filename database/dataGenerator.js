const faker = require('faker');
const Promise = require('bluebird');

const db = require('./postgres.js');

const generateInventory = () => {
  db.Inventory.sync()
    .catch(error => ('Error creating inventory table', error))
    .then(() => {
      for (let i = 0; i < 5000; i++) {
        createProduct();
      }
    })
    .then(() => console.log('Successfully created products'))
    .catch(error => ('Error creating products', error));
};

const createProduct = () => {
  let randomName = faker.commerce.productName();
  let randomDescription = faker.lorem.sentence();
  let randomImage = faker.image.imageUrl();
  let randomCategory = faker.commerce.department();
  let randomPrice = faker.commerce.price();
  let randomInventoryCount = Math.floor(Math.random() * 10000);

  db.Inventory.create({
    product_name: randomName,
    product_description: randomDescription,
    product_image: randomImage,
    category: randomCategory,
    price: randomPrice,
    inventory_count: randomInventoryCount,
  });
    // .then(inventory => console.log('created new product'));
}

generateInventory();