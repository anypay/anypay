'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WebhookAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  WebhookAttempt.init({
    webhook_id: DataTypes.INTEGER,
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    response_code: DataTypes.INTEGER,
    response_body: DataTypes.TEXT,
    error: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'WebhookAttempt',
  });
  return WebhookAttempt;
};