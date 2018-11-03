var sequelize = require('../database');
var Sequelize = require('sequelize');

var PayrollAccount = sequelize.define('PayrollAccount', {
  account_id: Sequelize.DataTypes.INTEGER,
  active: Sequelize.DataTypes.BOOLEAN,
  base_currency: Sequelize.DataTypes.STRING,
  base_monthly_amount: Sequelize.DataTypes.DECIMAL,
  base_daily_amount: Sequelize.DataTypes.DECIMAL
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },

  tableName: 'payroll_accounts'
});

module.exports = PayrollAccount;

