'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    account_id: DataTypes.INTEGER,
    percent: DataTypes.DECIMAL,
    currency: DataTypes.STRING
  }, {});
  Discount.associate = function(models) {
    // associations can be defined here
  };
  return Discount;
};