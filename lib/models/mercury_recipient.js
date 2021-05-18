'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MercuryRecipient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  MercuryRecipient.init({
    account_id: DataTypes.INTEGER,
    recipientId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MercuryRecipient',
  });
  return MercuryRecipient;
};
