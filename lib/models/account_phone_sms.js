'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccountPhoneSms = sequelize.define('AccountPhoneSms', {
    account_id: DataTypes.INTEGER,
    phone_number: DataTypes.STRING,
    sms_enabled: DataTypes.BOOLEAN,
    name: DataTypes.STRING
  }, {});
  AccountPhoneSms.associate = function(models) {
    // associations can be defined here
  };
  return AccountPhoneSms;
};