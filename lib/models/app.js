'use strict';

const { PrivateKey } = require('bsv')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class App extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  App.init({
    account_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    webhook_url: DataTypes.STRING,
    public_key: DataTypes.STRING,
    private_key: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'App',
    hooks: {
      beforeCreate: (record, options) => {
        if (!record.private_key) {
          const privateKey = new PrivateKey()
          record.private_key = privateKey.toWIF()
          record.public_key = privateKey.toPublicKey().toString()
        }
      }
    }
  });
  return App;
};
