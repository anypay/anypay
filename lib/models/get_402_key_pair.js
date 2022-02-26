'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Get402KeyPair extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Get402KeyPair.init({
    account_id: DataTypes.NUMBER,
    active: DataTypes.BOOLEAN,
    identifier: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Get402KeyPair',
  });
  return Get402KeyPair;
};