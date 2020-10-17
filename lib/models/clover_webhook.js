'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CloverWebhook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CloverWebhook.init({
    payload: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'CloverWebhook',
  });
  return CloverWebhook;
};