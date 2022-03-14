'use strict';

const amqp = require('../amqp');

module.exports = function(sequelize, Sequelize) {
  var ambassador = sequelize.define('ambassador', {
    account_id: Sequelize.DataTypes.INTEGER,
    name: Sequelize.DataTypes.STRING,
    enabled: Sequelize.DataTypes.BOOLEAN,
    parent_id: Sequelize.DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ambassador;
};
