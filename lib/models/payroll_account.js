'use strict';
module.exports = (sequelize, DataTypes) => {
  var PayrollAccount = sequelize.define('PayrollAccount', {
    account_id: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    base_currency: DataTypes.STRING,
    base_monthly_amount: DataTypes.DECIMAL,
    base_daily_amount: DataTypes.DECIMAL
  }, {
    tableName: 'payroll_accounts',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PayrollAccount;
};
