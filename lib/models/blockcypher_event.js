'use strict';
module.exports = function(sequelize, DataTypes) {
  var BlockcypherEvent = sequelize.define('blockcypher_event', {
    type: DataTypes.STRING,
    payload: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherEvent;
};
