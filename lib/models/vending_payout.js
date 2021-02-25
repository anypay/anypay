'use strict';
module.exports = (sequelize, DataTypes) => {
  const VendingPayout = sequelize.define('VendingPayout', {
    vending_machine_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    txid: DataTypes.STRING,
    address: DataTypes.STRING,
    currency: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    bank_account_id: DataTypes.INTEGER,
    check_number: DataTypes.STRING,
    month_of_activity: DataTypes.STRING,
    bank_paid_from: DataTypes.STRING,
    payment_date: DataTypes.DATE,
    note: DataTypes.TEXT
  }, {});
  VendingPayout.associate = function(models) {
    // associations can be defined here
  };
  return VendingPayout;
};
