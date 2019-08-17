'use strict';

const amqp = require('../amqp');
const log = require('../logger').log;

module.exports = (sequelize, Sequelize) => {
  var ambassador_team_join_request = sequelize.define('ambassador_team_join_request', {
    team_id: Sequelize.DataTypes.INTEGER,
    account_id: Sequelize.DataTypes.INTEGER,
    status: Sequelize.DataTypes.STRING
  }, {});
  ambassador_team_join_request.associate = function(models) {
    // associations can be defined here
  };
  return ambassador_team_join_request;
};
