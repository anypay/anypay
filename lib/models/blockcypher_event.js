'use strict';
module.exports = function(sequelize, DataTypes) {
  var BlockcypherEvent = sequelize.define('blockcypher_event', {
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
