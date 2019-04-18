'use strict';
module.exports = (sequelize, DataTypes) => {
  var CoinOracle = sequelize.define('CoinOracle', {
    coin: DataTypes.STRING,
    access_token_hash: DataTypes.STRING
  }, {

    tableName: 'coin_oracles',

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CoinOracle;
};
