'use strict';
  
module.exports = function(sequelize, Sequelize) {
  var AmbassadorTeamMember = sequelize.define('ambassador_team_member', {
    team_id: Sequelize.DataTypes.INTEGER,
    account_id: Sequelize.DataTypes.INTEGER,
    ambassador_id: Sequelize.DataTypes.INTEGER	  
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AmbassadorTeamMember;
};
