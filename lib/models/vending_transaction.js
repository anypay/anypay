'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('vending_transaction', {
    account_id: DataTypes.INTEGER,
    vending_machine_id: DataTypes.STRING,
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
    exchange_price: DataTypes.DECIMAL(10,2),
    spot_price: DataTypes.DECIMAL(10,2),
    fixed_transaction_fee: DataTypes.DECIMAL(10,2),
    expected_profit_setting: DataTypes.DECIMAL(10,2),
    expected_profit_value: DataTypes.DECIMAL(10,2),
    name_of_crypto_setting_used: DataTypes.STRING,
    additional_output_strategy_id: DataTypes.INTEGER,
    additional_output_usd_paid: DataTypes.DECIMAL,
    additional_output_bch_paid: DataTypes.DECIMAL,
    additional_output_hash: DataTypes.STRING,
    additional_output_error: DataTypes.STRING,
  }, {});
  transaction.associate = function(models) {
    // associations can be defined here
  };
  return transaction;
};
