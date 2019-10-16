'use strict';
module.exports = (sequelize, DataTypes) => {
  var GeneralbytesSale = sequelize.define('GeneralbytesSale', {
    terminal_sn: DataTypes.STRING,
    server_time: DataTypes.DATE,
    terminal_time: DataTypes.DATE,
    local_transaction_id: DataTypes.STRING,
    remote_transaction_id: DataTypes.STRING,
    type: DataTypes.STRING,
    cash_amount: DataTypes.INTEGER,
    cash_currency: DataTypes.STRING,
    crypto_amount: DataTypes.DECIMAL,
    crypto_currency: DataTypes.STRING,
    used_discount: DataTypes.STRING,
    actual_discount: DataTypes.DECIMAL,
    destination_address: DataTypes.STRING,
    related_remote_transaction_id: DataTypes.STRING,
    identity: DataTypes.STRING,
    status: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    transaction_detail: DataTypes.STRING,
    transaction_note: DataTypes.STRING,
    rate_including_fee: DataTypes.DECIMAL,
    rate_without_fee: DataTypes.DECIMAL,
    fixed_transaction_fee: DataTypes.DECIMAL,
    expected_profit_percent_setting: DataTypes.DECIMAL,
    expected_profit_value: DataTypes.DECIMAL,
    crypto_setting_name: DataTypes.STRING,
    identity_first_name: DataTypes.STRING,
    identity_id_card_number: DataTypes.STRING,
    identity_phone_number: DataTypes.STRING
  }, {
    tableName: 'generalbytes_sales',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return GeneralbytesSale;
};
