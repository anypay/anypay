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
    invoice_uid: DataTypes.STRING,
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "success",
        "failed"
      ),
      defaultValue: 'pending'
    },
    retry_policy: {
      type: DataTypes.ENUM(
        "no_retry"
      ),
      defaultValue: "no_retry"
    }
  }, {});
  Webhook.associate = function(models) {
    // associations can be defined here
  };
  return Webhook;
};
