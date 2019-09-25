'use strict';
module.exports = (sequelize, Sequelize) => {
  var BlockcypherPaymentForward = sequelize.define('blockcypher_payment_forward', {
    payment_id: {
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
    mining_fee_satoshis: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    process_fees_satoshis: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    process_fees_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    callback_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherPaymentForward;
};
