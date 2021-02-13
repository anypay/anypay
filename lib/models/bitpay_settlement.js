'use strict';
module.exports = (sequelize, DataTypes) => {
  const Settlement = sequelize.define('BitpaySettlement', {
    invoice_uid: DataTypes.STRING,
    txid: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    error: DataTypes.STRING,
    url: DataTypes.STRING,
    account_id: DataTypes.INTEGER
  }, {
    tableName: 'bitpay_settlements' 
  });
  Settlement.associate = function(models) {
    // associations can be defined here
  };
  return Settlement;
};
