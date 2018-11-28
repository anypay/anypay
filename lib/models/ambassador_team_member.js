'use strict';
module.exports = (sequelize, DataTypes) => {
  var ambassador_team_member = sequelize.define('ambassador_team_member', {
    account_id: DataTypes.INTEGER,
    ambassador_id: DataTypes.INTEGER,
    team_id: DataTypes.INTEGER
  }, {});
  ambassador_team_member.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team_member;
};