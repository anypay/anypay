'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../database');

var DashBackMerchant = sequelize.define('DashBackMerchant', {
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
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },
  tableName: 'dash_back_merchants'
});

module.exports = DashBackMerchant;

