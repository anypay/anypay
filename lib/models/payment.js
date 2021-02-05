'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Payment.init({
    invoice_uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_option_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    txhex: {
      type: DataTypes.STRING,
    },
    txjson: {
      type: DataTypes.JSON
    },
    wallet: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });
  return Payment;
};
