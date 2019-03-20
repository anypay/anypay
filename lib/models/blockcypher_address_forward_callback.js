'use strict';
module.exports = (sequelize, DataTypes) => {
  var blockcypher_forward_callback = sequelize.define('blockcypher_address_forward_callback', {
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    input_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_transaction_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    transaction_hash: {
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
  return blockcypher_forward_callback;
};
