'use strict';
module.exports = (sequelize, DataTypes) => {
  var MerchantGroup = sequelize.define('MerchantGroup', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    account_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MerchantGroup;
};
