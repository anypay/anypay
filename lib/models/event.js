'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    account_id: DataTypes.INTEGER,
    invoice_uid: DataTypes.STRING,
    app_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    payload: DataTypes.JSON,
    namespace: DataTypes.STRING
  }, {
    tableName: 'events'
  });
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
