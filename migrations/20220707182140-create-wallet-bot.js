'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WalletBots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      identifier: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.NUMBER
      },
      app_id: {
        type: Sequelize.NUMBER
      },
      slack_webhook_url: {
        type: Sequelize.STRING
      },
      webhook_url: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WalletBots');
  }
};