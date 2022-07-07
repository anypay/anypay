'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WalletBot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  WalletBot.init({
    identifier: DataTypes.TEXT,
    name: DataTypes.STRING,
    account_id: DataTypes.NUMBER,
    app_id: DataTypes.NUMBER,
    slack_webhook_url: DataTypes.STRING,
    webhook_url: DataTypes.STRING,
    email_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WalletBot',
  });
  return WalletBot;
};