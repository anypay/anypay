'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = (sequelize, DataTypes) => {
  var AccountRoute = sequelize.define('AccountRoute', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    input_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    output_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    output_address: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AccountRoute;
};
