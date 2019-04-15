'use strict';
module.exports = (sequelize, DataTypes) => {
  var AddressRoute = sequelize.define('AddressRoute', {
    input_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    output_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    output_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'address_routes',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AddressRoute;
};
