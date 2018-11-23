'use strict';

module.exports = function(sequelize, Sequelize) {
  var AmbassadorTeam = sequelize.define('ambassador_team', {
    leader_account_id: Sequelize.DataTypes.INTEGER,
    team_name: Sequelize.DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AmbassadorTeam;
};
