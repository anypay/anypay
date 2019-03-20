'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../database');

var CashbackCustomerPayment = sequelize.define('CashbackCustomerPayment', {
  cashback_merchant_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  invoice_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  transaction_hash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },
  tableName: 'cashback_customer_payments'
});

module.exports = CashbackCustomerPayment;
