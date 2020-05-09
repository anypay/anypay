'use strict';
module.exports = (sequelize, DataTypes) => {
  const EnergyCityAccount = sequelize.define('EnergyCityAccount', {
    moneybutton_id: DataTypes.INTEGER
  }, {});
  EnergyCityAccount.associate = function(models) {
    // associations can be defined here
  };
  return EnergyCityAccount;
};