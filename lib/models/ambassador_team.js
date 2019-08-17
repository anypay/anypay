'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = (sequelize, Sequelize) => {
  var ambassador_team = sequelize.define('ambassador_team', {
    team_name: Sequelize.DataTypes.STRING,
    leader_account_id: Sequelize.DataTypes.INTEGER
  }, {});
  ambassador_team.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team;
};
