'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('vending_transaction', {
    account_id: DataTypes.INTEGER,
    terminal_id: DataTypes.STRING,
    server_time: DataTypes.DATE,
    terminal_time: DataTypes.DATE,
    localtid: DataTypes.STRING,
    remotetid: DataTypes.STRING,
    type: DataTypes.STRING,
    cash_amount: DataTypes.DECIMAL,
    cash_currency: DataTypes.STRING,
    crypto_currency: DataTypes.STRING,
    crypto_amount: DataTypes.DECIMAL,
    crypto_address: DataTypes.STRING,
    status: DataTypes.STRING,
    hash: DataTypes.STRING,
    exchange_price: DataTypes.STRING,
    spot_price: DataTypes.DECIMAL,
    fixed_transaction_fee: DataTypes.DECIMAL,
    expected_profit_setting: DataTypes.DECIMAL,
    expected_profit_value: DataTypes.DECIMAL,
    name_of_crypto_setting_used: DataTypes.STRING
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };
  return transaction;
};
