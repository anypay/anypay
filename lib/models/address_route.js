'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = function(sequelize, Sequelize) {
  var AddressRoute = sequelize.define('AddressRoute', {
    input_address: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    input_currency: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    output_address: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    output_currency: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    expires: {
      type: Sequelize.DataTypes.DATE,
      allowNull: true
    },
    is_static: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
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
