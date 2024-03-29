'use strict';
module.exports = (sequelize, DataTypes) => {
  var Price = sequelize.define('price', {
    currency: {
      allowNull: false,
      type: DataTypes.STRING
    },
    value: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("value"));
      }
    },
    base: {
      field: 'base_currency',
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: 'BTC'
    },
    source: {
      allowNull: true,
      type: DataTypes.STRING
    },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Price;
};
