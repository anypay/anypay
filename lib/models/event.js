'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    account_id: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payload: DataTypes.JSON,
    error: DataTypes.BOOLEAN,
    namespace: DataTypes.STRING
  }, {
    tableName: 'events'
  });
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
