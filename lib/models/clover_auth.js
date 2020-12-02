'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CloverAuth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CloverAuth.init({
    account_id: DataTypes.INTEGER,
    client_id: DataTypes.STRING,
    merchant_id: DataTypes.STRING,
    employee_id: DataTypes.STRING,
    access_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CloverAuth',
  });
  return CloverAuth;
};
