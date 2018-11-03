var sequelize = require('../database');
var Sequelize = require('sequelize');

var PayrollInvoice = sequelize.define('PayrollInvoice', {
  payroll_account_id: Sequelize.DataTypes.INTEGER,
  invoice_id: Sequelize.DataTypes.INTEGER
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  }
});

module.exports = PayrollInvoice;

