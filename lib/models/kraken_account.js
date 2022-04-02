'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KrakenAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  KrakenAccount.init({
    account_id: {

      type: DataTypes.NUMBER,

      allowNull: false

    },
    api_key: {

      type: DataTypes.STRING,

      allowNull: false

    },
    api_secret: {

      type: DataTypes.STRING,

      allowNull: false

    },

    autosell: {

      type: DataTypes.ARRAY(DataTypes.STRING),

      allowNull: false,

      defaultValue: []

    }
  }, {
    sequelize,
    modelName: 'KrakenAccount',
  });
  return KrakenAccount;
};
