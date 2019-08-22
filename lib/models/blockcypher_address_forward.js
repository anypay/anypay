'use strict';

module.exports = (sequelize, Sequelize) => {
  var blockcypher_address_forward = sequelize.define('blockcypher_address_forward', {
    uid: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    destination: {
      type: Sequelize.STRING,
      allowNull: false
    },
    input_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    process_fees_address: {
      type: Sequelize.STRING
    },
    process_fees_satoshis: {
      type: Sequelize.INTEGER
    },
    process_fees_percent: {
      type: Sequelize.DECIMAL
    },
    callback_url: {
      type: Sequelize.STRING
    },
    enable_confirmations: {
      type: Sequelize.BOOLEAN
    },
    mining_fees_satoshis: {
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return blockcypher_address_forward;
};
