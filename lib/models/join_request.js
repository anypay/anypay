'use strict';

module.exports = function(sequelize, Sequelize) {
  var JoinRequest = sequelize.define('join_request', {
    team_id: Sequelize.DataTypes.INTEGER,
    account_id: Sequelize.DataTypes.INTEGER,
    status: Sequelize.DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return JoinRequest;
};
