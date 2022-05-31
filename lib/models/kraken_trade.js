'use strict';
module.exports = (sequelize, DataTypes) => {
  const KrakenTrade = sequelize.define('KrakenTrade', {
    account_id: DataTypes.INTEGER,
    tradeid: DataTypes.STRING,
    ordertxid: DataTypes.STRING,
    postxid: DataTypes.STRING,
    pair: DataTypes.STRING,
    time: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    type: DataTypes.STRING,
    ordertype: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    cost: DataTypes.DECIMAL,
    fee: DataTypes.DECIMAL,
    vol: DataTypes.DECIMAL,
    margin: DataTypes.DECIMAL,
    misc: DataTypes.STRING
  }, {

    hooks: {

      beforeCreate(record, options) {
        record.dataValues.date = new Date(record.dataValues.time * 1000)
      }
    }

  });
  KrakenTrade.associate = function(models) {
    // associations can be defined here
  };
  return KrakenTrade;
};
