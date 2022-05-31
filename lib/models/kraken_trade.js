'use strict';
module.exports = (sequelize, DataTypes) => {
  const KrakenTrade = sequelize.define('KrakenTrade', {
    account_id: DataTypes.INTEGER,
    tradeid: DataTypes.STRING,
    ordertxid: DataTypes.STRING,
    postxid: DataTypes.STRING,
    pair: DataTypes.STRING,
    time: DataTypes.DECIMAL,
    type: DataTypes.STRING,
    ordertype: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    cost: DataTypes.DECIMAL,
    fee: DataTypes.DECIMAL,
    vol: DataTypes.DECIMAL,
    margin: DataTypes.DECIMAL,
    misc: DataTypes.STRING
  }, {});
  KrakenTrade.associate = function(models) {
    // associations can be defined here
  };
  return KrakenTrade;
};
