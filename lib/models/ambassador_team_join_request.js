'use strict';
module.exports = (sequelize, DataTypes) => {
  var ambassador_team_join_request = sequelize.define('ambassador_team_join_request', {
    team_id: DataTypes.INTEGER,
    account_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  ambassador_team_join_request.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team_join_request;
};