const Sequelize = require('sequelize');

let params = {
  host: 'localhost',
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: { ssl: true },
};

const db = new Sequelize('postgres://postgres:password@localhost:5433/bundlin');

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

exports.db = db;
exports.Inventory = Inventory;