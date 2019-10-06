'use strict';
module.exports = (sequelize, DataTypes) => {
  var PaymentOption = sequelize.define('PaymentOption', {
    invoice_uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
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
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uri: {
      type: DataTypes.STRING,
      allowNull: true
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'payment_options',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PaymentOption;
};
