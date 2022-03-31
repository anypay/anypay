'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KrakenAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  KrakenAccount.init({
    account_id: DataTypes.NUMBER,
    api_key: DataTypes.STRING,
    api_secret: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'KrakenAccount',
  });
  return KrakenAccount;
};