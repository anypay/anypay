'use strict';
module.exports = (sequelize, DataTypes) => {
  var RouterTransaction = sequelize.define('RouterTransaction', {

    input_txid: {
      type: DataTypes.STRING,
      allowNull: false
    },

    input_amount: DataTypes.STRING,

    input_currency: DataTypes.STRING,

    input_address: DataTypes.STRING,

    output_txid: DataTypes.STRING,

    output_currency: {
      type: DataTypes.STRING,
      allowNull: false
    },

    output_amount: {
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
  return RouterTransaction;
};
