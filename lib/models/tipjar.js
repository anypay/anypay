'use strict';
module.exports = (sequelize, DataTypes) => {
  var TipJar = sequelize.define('TipJar', {

    account_id: DataTypes.INTEGER,

    private_key: DataTypes.STRING,

    address: DataTypes.STRING,

    currency: DataTypes.STRING

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
