'use strict';
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    account_id: DataTypes.INTEGER,
    event: DataTypes.STRING,
    type: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.getDataValue("event");
      },
    },
    payload: DataTypes.JSON
  }, {
    tableName: 'events'
  });
  Event.associate = function(models) {
    // associations can be defined here
  };
  return Event;
};
