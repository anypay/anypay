'use strict';

module.exports = function(sequelize, Sequelize) {
  var AmbassadorTeam = sequelize.define('ambassador', {
    leader_account_id: Sequelize.DataTypes.INTEGER,
    name: Sequelize.DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AmbassadorTeam;
};
