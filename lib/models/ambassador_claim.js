'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = (sequelize, Sequelize) => {
  var AmbassadorClaim = sequelize.define('AmbassadorClaim', {
    ambassador_id: Sequelize.DataTypes.INTEGER,
    merchant_account_id: Sequelize.DataTypes.INTEGER,
    status: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: 'unverified'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }, 

    tableName: 'ambassador_claims'
  });
  return AmbassadorClaim;
};
