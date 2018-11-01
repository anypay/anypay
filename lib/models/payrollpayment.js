'use strict';
module.exports = function(sequelize, DataTypes) {
  var PayrollPayment = sequelize.define('PayrollPayment', {
    payroll_account_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    hash: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PayrollPayment;
};