const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');

const Invoice = sequelize.define('invoice', {
  uid: Sequelize.STRING,
  amount: Sequelize.DECIMAL,
  address: Sequelize.STRING,
  account_id: Sequelize.INTEGER,
  access_token: Sequelize.STRING,
	hash: Sequelize.STRING,
	status: Sequelize.STRING
}, {
  hooks: {
    beforeCreate: (invoice, options) => {
      invoice.uid = uuid.v4();
    }
  }
});

module.exports = Invoice;

