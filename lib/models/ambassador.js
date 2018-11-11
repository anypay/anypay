'use strict';

module.exports = function(sequelize, Sequelize) {
  var ambassador = sequelize.define('ambassador', {
    account_id: Sequelize.DataTypes.INTEGER,
    name: Sequelize.DataTypes.STRING,
    enabled: Sequelize.DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ambassador;
};
