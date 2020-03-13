'use strict';
module.exports = (sequelize, DataTypes) => {
  const SideshiftQuote = sequelize.define('SideshiftQuote', {
    quoteId: DataTypes.STRING,
    depositMethodId: DataTypes.STRING,
    settlementMethodId: DataTypes.STRING,
    depositAddress_address: DataTypes.STRING,
    settlementAddress_address: DataTypes.STRING,
    invoice_uid: DataTypes.STRING,
    account_route_id: DataTypes.INTEGER
  }, {});
  SideshiftQuote.associate = function(models) {
    // associations can be defined here
  };
  return SideshiftQuote;
};
