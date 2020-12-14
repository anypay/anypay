'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LogEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LogEvent.init({
    event: DataTypes.STRING,
    payload: DataTypes.JSON,
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LogEvent',
  });
  return LogEvent;
};