'use strict';
module.exports = (sequelize, DataTypes) => {
  var PayrollPayment = sequelize.define('PayrollPayment', {
    payroll_account_id: DataTypes.INTEGER,
    payroll_batch_id: DataTypes.INTEGER,
    denomination_amount: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    denomination_currency: DataTypes.STRING,
    currency: DataTypes.STRING,
    hash: DataTypes.STRING,
    error: DataTypes.STRING,
    paid_at: DataTypes.DATE,
    address: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PayrollPayment;
};