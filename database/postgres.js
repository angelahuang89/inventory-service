const Sequelize = require('sequelize');

let params = {
  host: 'localhost',
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: { ssl: true },
};

const db = new Sequelize('postgres://postgres:password@localhost:5433/bundlin');
const Op = Sequelize.Op;

db.authenticate()
  .then(() => console.log('Connection established'))
  .catch(err => console.error('Connection error'));

const Inventory = db.define('inventory', {
  product_name: Sequelize.STRING,
  product_description: Sequelize.STRING,
  product_image: Sequelize.STRING,
  category: Sequelize.STRING,
  price: Sequelize.DECIMAL,
  inventory_count: Sequelize.INTEGER,
});

const checkIfTableExists = () => {
  Inventory.sync()
    .catch(error => ('Error creating inventory table', error))
};

const searchForProducts = (searchTerm) => {
  let value = searchTerm.toLowerCase();
  value = `%${value}%`;
  return Inventory.findAll({
    where: {
      [Op.or]:
        // [
        {product_name: {[Op.iLike]: value}},
          // {product_description: {[Op.iLike]: value}},
        // ]
    }
  })
    .catch(error => console.log('Error in searching database', error));
}

const getProductInfo = (productId) => {
  return Inventory.findAll({
    where: {id: productId}
  })
    .catch(error => console.error('Error retrieving product info', error));
};

const addNewProduct = (product) => {
  return Inventory.create(product)
    .then((results) => {
      return Inventory.findOne({
        where: {
          product_name: product.product_name
        },
        attributes: ['product_name', 'id'],
      })
    })
    .catch(error => console.error('Error creating product'));
};

const addNewProducts = (products) => {
  return Inventory.bulkCreate(products)
    .then(() => {
      const names = products.map(product => product.product_name);
      return Inventory.findAll({
        where: {
          product_name: {[Op.or]: names}
        },
        attributes: ['product_name', 'id'],
      });
    })
    .catch(error => console.error('Error creating products', error));
};

const removeProduct = (productId) => {
  return Inventory.destroy({
    where: {id: productId}
  })
    .then(() => console.log('Remove discontinued product'))
    .catch(error => console.error('Error removing discontinued products', error));
};

const removeProducts = (productIds) => {
  return Inventory.destroy({
    where: {
      id: {[Op.or]: productIds}
    }
  })
   .then(() => console.log('Removed discontinued products'))
   .catch(error => console.error('Error removing discontinued products', error));
};

const restockProducts = (product) => {
  // return productInfo.forEach(product => {
    const productId = parseInt(product.ProductId.StringValue, 10);
    const quantity = parseInt(product.Quantity.StringValue, 10);
    return Inventory.update({
      inventory_count: Sequelize.literal(`inventory_count + ${quantity}`)
    }, {
      where: {
        id: productId
      }
    })
      .then(() => console.log('Updated inventory count after restock'))
      // .catch(error => console.error('Error updating inventory after restock'), error);
  // });
};

const updateProductCounts = (product) => {
  // return productInfo.forEach(product => {
    const productId = parseInt(product.ProductId.StringValue, 10);
    const quantity = parseInt(product.Quantity.StringValue, 10);
    console.log(quantity)
    console.log(typeof quantity)
    return Inventory.update({
      inventory_count: Sequelize.literal(`inventory_count - ${quantity}`)
    }, {
      where: {
        id: productId
      }
    })
       .then(() => console.log('Updated inventory count after purchase'))
       // .catch(error => console.error('Error updating inventory after purchase'), error);
  // });
};

exports.db = db;
exports.Inventory = Inventory;
exports.checkIfTableExists = checkIfTableExists;
exports.searchForProducts = searchForProducts;
exports.getProductInfo = getProductInfo;
exports.addNewProduct = addNewProduct;
exports.addNewProducts = addNewProducts;
exports.removeProducts = removeProducts;
exports.restockProducts = restockProducts;
exports.updateProductCounts = updateProductCounts;
