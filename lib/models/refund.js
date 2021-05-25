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
    invoice_uid: DataTypes.STRING,
    txid: DataTypes.STRING,
    rawtx: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Refund',
  });
  return Refund;
};