'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Refund.init({
    original_invoice_uid: DataTypes.STRING,
    refund_invoice_uid: DataTypes.STRING,
    address: DataTypes.STRING,
    txid: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Refund',
  });
  return Refund;
};
