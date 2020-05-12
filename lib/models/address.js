'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = function(sequelize, Sequelize) {
  var Address = sequelize.define('address', {
    account_id: Sequelize.INTEGER,
    currency: Sequelize.STRING,
    plugin: Sequelize.STRING,
    value: Sequelize.STRING,
    paymail: Sequelize.STRING,
    note: Sequelize.STRING,
    price_scalar: Sequelize.DECIMAL,
    locked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    nonce: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Address;
}


