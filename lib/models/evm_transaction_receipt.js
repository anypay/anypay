'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EvmTransactionReceipt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EvmTransactionReceipt.init({
    txid: DataTypes.STRING,
    receipt: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'EvmTransactionReceipt',
  });
  return EvmTransactionReceipt;
};