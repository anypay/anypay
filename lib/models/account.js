const Sequelize = require('sequelize');
const sequelize = require('../database');

const Account = sequelize.define('account', {
  uid: Sequelize.STRING
});

module.exports = Account;

