'use strict';
module.exports = (sequelize, DataTypes) => {
  const Settlement = sequelize.define('Settlement', {
    invoice_uid: DataTypes.STRING,
    txid: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    error: DataTypes.STRING,
    url: DataTypes.STRING,
    account_id: DataTypes.INTEGER
  }, {
    tableName: 'settlements' 
  });
  Settlement.associate = function(models) {
    // associations can be defined here
  };
  return Settlement;
};
