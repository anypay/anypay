const Sequelize = require('sequelize');
const sequelize = require('../database');

const Invoice = sequelize.define('invoice', {
  uid: Sequelize.STRING,
  amount: Sequelize.DECIMAL,
  address: Sequelize.STRING,
	hash: Sequelize.STRING,
	status: Sequelize.STRING
});

module.exports = Invoice;

