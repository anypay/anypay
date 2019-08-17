'use strict';
module.exports = function(sequelize, Sequelize) {
  var BlockcypherEvent = sequelize.define('blockcypher_event', {
    type: Sequelize.STRING,
    payload: Sequelize.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherEvent;
};
