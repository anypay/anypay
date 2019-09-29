'use strict';
module.exports = (sequelize, DataTypes) => {

  const TipjarClaim = sequelize.define('TipjarClaim', {

    account_id: DataTypes.INTEGER,

    address: DataTypes.STRING,

    address_type: DataTypes.STRING,

    token: DataTypes.STRING

  }, {

    tableName: 'tipjar_claims' 
  });

  TipjarClaim.associate = function(models) {

    // associations can be defined here
  };
  return TipjarClaim;
};
