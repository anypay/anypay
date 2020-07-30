'use strict';
module.exports = (sequelize, DataTypes) => {
  const Discount = sequelize.define('Discount', {
    account_id: DataTypes.INTEGER,
    percent: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('percent'));
      }
    },
    active: DataTypes.BOOLEAN,
    coin: DataTypes.STRING
  }, {
    tableName: 'discounts' 
  });
  Discount.associate = function(models) {
    // associations can be defined here
  };
  return Discount;
};
