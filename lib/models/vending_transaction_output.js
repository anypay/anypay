'use strict';
module.exports = (sequelize, DataTypes) => {
  const vending_transaction_output = sequelize.define('vending_transaction_output', {
    vending_transaction_id: DataTypes.INTEGER,
    isKioskCustomer: DataTypes.BOOLEAN,
    account_id: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    hash: DataTypes.STRING,
    output_index: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL
  }, {});
  vending_transaction_output.associate = function(models) {
    // associations can be defined here
  };
  return vending_transaction_output;
};