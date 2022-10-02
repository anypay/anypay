'use strict';

const uuid = require("uuid")

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
    identifier: {
      type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    account_id: DataTypes.NUMBER,
    app_id: DataTypes.NUMBER,
    slack_webhook_url: DataTypes.STRING,
    webhook_url: DataTypes.STRING,
    email_address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WalletBot',
    hooks: {
      beforeCreate: (record, options) => {
        record.identifier = uuid.v4();
      }
    }
  });
  return WalletBot;
};
