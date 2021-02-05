'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AnypayxDebit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  AnypayxDebit.init({
    account_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    external_id: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AnypayxDebit',
  });
  return AnypayxDebit;
};
