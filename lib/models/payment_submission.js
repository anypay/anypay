'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentSubmission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PaymentSubmission.init({
    invoice_uid: DataTypes.STRING,
    txhex: DataTypes.TEXT,
    currency: DataTypes.STRING,
    headers: DataTypes.JSON,
    wallet: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaymentSubmission',
  });
  return PaymentSubmission;
};