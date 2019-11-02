'use strict';
module.exports = (sequelize, DataTypes) => {
  var TipJar = sequelize.define('TipJar', {

    account_id: DataTypes.INTEGER,

    private_key: DataTypes.STRING,

    address: DataTypes.STRING,

    currency: DataTypes.STRING,

    claim_txid: DataTypes.STRING,

    claim_alias: DataTypes.STRING,

    claim_address: DataTypes.STRING,

    claimed: DataTypes.BOOLEAN

  }, {

    tableName: 'tipjars',
    
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return TipJar;
};
