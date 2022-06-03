'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KrakenDeposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  KrakenDeposit.init({
    account_id: DataTypes.INTEGER,
    kraken_account_id: DataTypes.INTEGER,
    method: DataTypes.STRING,
    aclass: DataTypes.STRING,
    asset: DataTypes.STRING,
    refid: DataTypes.STRING,
    txid: DataTypes.STRING,
    info: DataTypes.STRING,
    amount: DataTypes.STRING,
    fee: {
      type: DataTypes.STRING,
      defaultValue: '0.00000000',
    },
    time: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'KrakenDeposit',
  });
  return KrakenDeposit;
};
