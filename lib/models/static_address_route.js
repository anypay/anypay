'use strict';
module.exports = (sequelize, DataTypes) => {
  var StaticAddressRoute = sequelize.define('StaticAddressRoute', {
    account_id: DataTypes.INTEGER,
    input_currency: DataTypes.STRING,
    output_currency: DataTypes.STRING,
    input_address: DataTypes.STRING,
    private_key_wif: DataTypes.STRING
  }, {
    tableName: 'static_address_routes',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return StaticAddressRoute;
};
