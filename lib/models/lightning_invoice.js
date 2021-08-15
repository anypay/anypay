'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LightningInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  LightningInvoice.init({
    r_hash: DataTypes.STRING,
    payment_request: DataTypes.TEXT,
    add_index: DataTypes.STRING,
    payment_addr: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LightningInvoice',
  });
  return LightningInvoice;
};