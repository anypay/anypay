'use strict';
module.exports = function(sequelize, DataTypes) {
  var BlockcypherHook = sequelize.define('BlockcypherHook', {
    uid: DataTypes.STRING,
    event: DataTypes.STRING,
    address: DataTypes.STRING,
    url: DataTypes.STRING,
    callback_errors: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BlockcypherHook;
};