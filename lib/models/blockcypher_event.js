'use strict';
module.exports = function(sequelize, DataTypes) {
  var BlockcypherEvent = sequelize.define('BlockcypherEvent', {
    type: DataTypes.STRING,
    payload: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherEvent;
};