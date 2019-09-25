'use strict';


const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = (sequelize, Sequelize) => {
  var ambassador_team_member = sequelize.define('ambassador_team_member', {
    account_id: Sequelize.INTEGER,
    ambassador_id: Sequelize.INTEGER,
    team_id: Sequelize.INTEGER
  }, {});
  ambassador_team_member.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team_member;
};
