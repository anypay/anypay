'use strict';
module.exports = (sequelize, DataTypes) => {
  const Webhook = sequelize.define('Webhook', {
    type: DataTypes.STRING,
    url: DataTypes.STRING,
    started_at: DataTypes.DATE,
    ended_at: DataTypes.DATE,
    response_code: DataTypes.INTEGER,
    response_body: DataTypes.TEXT,
    error: DataTypes.TEXT,
    invoice_uid: DataTypes.STRING
  }, {});
  Webhook.associate = function(models) {
    // associations can be defined here
  };
  return Webhook;
};
