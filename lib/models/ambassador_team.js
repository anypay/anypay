'use strict';
module.exports = (sequelize, DataTypes) => {
  var ambassador_team = sequelize.define('ambassador_team', {
    team_name: DataTypes.STRING,
    leader_account_id: DataTypes.INTEGER
  }, {});
  ambassador_team.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team;
};