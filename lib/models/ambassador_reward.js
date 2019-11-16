'use strict';
module.exports = (sequelize, DataTypes) => {
  const AmbassadorReward = sequelize.define('AmbassadorReward', {
    error: DataTypes.STRING,
    txid: DataTypes.STRING,
    currency: DataTypes.STRING,
    address: DataTypes.STRING,
    ambassador_id: DataTypes.INTEGER,
    invoice_uid: DataTypes.STRING
  }, {
    tableName: 'ambassador_rewards' 
  });
  AmbassadorReward.associate = function(models) {
    // associations can be defined here
  };
  return AmbassadorReward;
};
