'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    account_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    payload: DataTypes.JSON
  }, {
    tableName: 'events'
  });
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
