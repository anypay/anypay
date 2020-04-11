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
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    fee: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    outputs: {
      type: DataTypes.JSON,
      allowNull: false
    },
    uri: {
      type: DataTypes.STRING,
      allowNull: false
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    tableName: 'payment_options',
    classMethods: {
      associate: function(models) {

        models.Invoice.hasMany(models.PaymentOption);
        models.PaymentOption.belongsTo(models.Invoice);

        // associations can be defined here
      }
    }
  });
  return PaymentOption;
};
