'use strict';
module.exports = (sequelize, DataTypes) => {
  var SimpleWallet = sequelize.define('SimpleWallet', {
    name: DataTypes.STRING,
    currency: DataTypes.STRING,
    address: DataTypes.STRING,
    balance: DataTypes.DECIMAL,
    balance_updated_at: DataTypes.DATE
  }, {
    tableName: 'simple_wallets',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SimpleWallet;
};
