'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PriceRecord extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PriceRecord.init({
    currency: DataTypes.STRING,
    value: DataTypes.DECIMAL,
    base_currency: DataTypes.STRING,
    source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PriceRecord',
  });
  return PriceRecord;
};