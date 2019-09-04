'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = function(sequelize, Sequelize) {
  var AddressRoute = sequelize.define('AddressRoute', {
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    input_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    input_currency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    output_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    output_currency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expires: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_static: {
      type: Sequelize.BOOLEAN,
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
