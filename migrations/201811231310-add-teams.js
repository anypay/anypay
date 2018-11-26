'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ambassador_teams', {
      id: {
        allowNull: false,  
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      leader_account_id: {
        type: Sequelize.INTEGER
      },
      team_name: {
        type: Sequelize.STRING
      },
      enabled: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ambassadors');
  }
};
