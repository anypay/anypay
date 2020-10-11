'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bip70PaymentRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Bip70PaymentRequest.init({
    invoice_uid: DataTypes.STRING,
    hex: DataTypes.TEXT,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Bip70PaymentRequest',
  });
  return Bip70PaymentRequest;
};