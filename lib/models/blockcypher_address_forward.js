'use strict';
module.exports = (sequelize, DataTypes) => {
  var blockcypher_address_forward = sequelize.define('blockcypher_address_forward', {
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
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
    process_fees_address: {
      type: DataTypes.STRING
    },
    process_fees_satoshis: {
      type: DataTypes.INTEGER
    },
    process_fees_percent: {
      type: DataTypes.DECIMAL
    },
    callback_url: {
      type: DataTypes.STRING
    },
    enable_confirmations: {
      type: DataTypes.BOOLEAN
    },
    mining_fees_satoshis: {
      type: DataTypes.INTEGER
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
