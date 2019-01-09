'use strict';
module.exports = (sequelize, DataTypes) => {
  var BlockcypherPaymentForward = sequelize.define('blockcypher_payment_forward', {
    payment_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mining_fee_satoshis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    process_fees_satoshis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    process_fees_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    callback_url: {
      type: DataTypes.STRING,
      allowNull: true
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
