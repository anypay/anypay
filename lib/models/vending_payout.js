'use strict';
module.exports = (sequelize, DataTypes) => {
  const VendingPayout = sequelize.define('VendingPayout', {
    vending_machine_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    txid: DataTypes.STRING,
    address: DataTypes.STRING
  }, {});
  VendingPayout.associate = function(models) {
    // associations can be defined here
  };
  return VendingPayout;
};