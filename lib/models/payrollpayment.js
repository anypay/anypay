'use strict';

var sequelize = require('../database');
var Sequelize = require('sequelize');

var PayrollPayment = sequelize.define('PayrollPayment', {
  payroll_account_id: Sequelize.DataTypes.INTEGER,
  amount: Sequelize.DataTypes.DECIMAL,
  address: Sequelize.DataTypes.STRING,
  currency: Sequelize.DataTypes.STRING,
  hash: Sequelize.DataTypes.STRING
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },

  tableName: 'payroll_payments'
});

module.exports = PayrollPayment;
