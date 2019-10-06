'use strict';
module.exports = (sequelize, DataTypes) => {
  var Payment = sequelize.define('Payment', {
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('amount'));
      }
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    invoice_uid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    raw: {
      type: DataTypes.STRING,
      allowNull: true
    },
    json: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'payments',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Payment;
};
