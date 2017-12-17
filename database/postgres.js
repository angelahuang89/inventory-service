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

const addNewProducts = (products) => {
  Inventory.bulkCreate(arr)
    .then(() => console.log('Created new products'))
    .catch(error => console.error('Error creating products', error));
}

const removeProducts = (productIds) => {
  Inventory.destroy({
    where: {
      id: {[Op.or]: productIds}
    }
  })
   .then(() => console.log('Removed discontinued products'))
   .catch(error => console.error('Error removing discontinued products', error));
}

const updateProductCounts = (productIds) => {
  // Inventory.update
}

exports.db = db;
exports.Inventory = Inventory;
exports.checkIfTableExists = checkIfTableExists;
exports.searchForProducts = searchForProducts;
exports.addNewProducts = addNewProducts;
