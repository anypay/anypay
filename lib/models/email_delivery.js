'use strict';
module.exports = (sequelize, DataTypes) => {
  const EmailDelivery = sequelize.define('EmailDelivery', {
    email_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
    error: DataTypes.STRING,
    uid: DataTypes.STRING,
    sent_at: DataTypes.DATE
  }, {});
  EmailDelivery.associate = function(models) {
    // associations can be defined here
  };
  return EmailDelivery;
};