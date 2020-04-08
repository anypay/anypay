'use strict';
module.exports = (sequelize, DataTypes) => {
  const BlockchainReceipt = sequelize.define('BlockchainReceipt', {
    invoice_uid: DataTypes.STRING,
    txid: DataTypes.STRING,
    hex: DataTypes.TEXT,
    error: DataTypes.STRING,
    published_at: DataTypes.DATE
  }, {
    tableName: 'blockchain_receipts' 
  });
  BlockchainReceipt.associate = function(models) {
    // associations can be defined here
  };
  return BlockchainReceipt;
};
