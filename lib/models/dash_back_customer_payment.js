'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../database');

var DashBackCustomerPayment = sequelize.define('DashBackCustomerPayment', {
  dash_back_merchant_id: {
    type: Sequelize.INTEGER,
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
  tableName: 'dash_back_customer_payments'
});

module.exports = DashBackCustomerPayment;
