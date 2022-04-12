'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PaymentRequest.init({
    template: DataTypes.JSON,
    app_id: DataTypes.INTEGER,
    invoice_uid: DataTypes.INTEGER,
    webpage_url: DataTypes.STRING,
    uri: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaymentRequest',
  });
  return PaymentRequest;
};
