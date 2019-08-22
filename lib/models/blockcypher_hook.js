'use strict';
module.exports = function(sequelize, Sequelize) {
  var BlockcypherHook = sequelize.define('BlockcypherHook', {
    uid: Sequelize.STRING,
    event: Sequelize.STRING,
    address: Sequelize.STRING,
    url: Sequelize.STRING,
    callback_errors: Sequelize.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherHook;
};
