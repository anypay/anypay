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
    uid: DataTypes.STRING,
    template: DataTypes.JSON,
    app_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PaymentRequest',
  });
  return PaymentRequest;
};
