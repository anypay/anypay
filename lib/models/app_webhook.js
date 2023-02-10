'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AppWebhook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AppWebhook.init({
    app_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    events_blacklist: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    events_whitelist: {
      type: DataTypes.JSON,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'AppWebhook',
  });
  return AppWebhook;
};
