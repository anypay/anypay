'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../database');

var CashbackMerchant = sequelize.define('CashbackMerchant', {
  account_id: Sequelize.INTEGER,
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  percent: {
    type: Sequelize.DECIMAL,
    defaultValue: 20,
    get() {
      return parseFloat(this.getDataValue("percent"));
    }
  },
  customer_amount: {
    type: Sequelize.DECIMAL,
    defaultValue: 10,
    get() {
      return parseFloat(this.getDataValue("customer_amount"));
    }
  },
  customer_percent: {
    type: Sequelize.DECIMAL,
    defualtValue: 20,
    get() {
      return parseFloat(this.getDataValue("customer_percent"));
    }
  },
  merchant_amount: {
    type: Sequelize.DECIMAL,
    defaultValue: 20,
    get() {
      return parseFloat(this.getDataValue("merchant_amount"));
    }
  },
  merchant_percent: {
    type: Sequelize.DECIMAL,
    defualtValue: 20,
    get() {
      return parseFloat(this.getDataValue("merchant_percent"));
    }
  },
  customer_strategy: {
    type: Sequelize.STRING,
    defaultValue: 'lesser-of-amount-or-percent'
  },
  merchant_strategy: {
    type: Sequelize.STRING,
    defaultValue: 'lesser-of-amount-or-percent'
  },
  ambassador_id: {
    type: Sequelize.INTEGER
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },
  tableName: 'cashback_merchants'
});

module.exports = CashbackMerchant;

