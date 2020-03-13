'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SideshiftQuotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quoteId: {
        type: Sequelize.STRING
      },
      depositMethodId: {
        type: Sequelize.STRING
      },
      settlementMethodId: {
        type: Sequelize.STRING
      },
      depositAddress_address: {
        type: Sequelize.STRING
      },
      settlementAddress_address: {
        type: Sequelize.STRING
      },
      invoice_uid: {
        type: Sequelize.STRING
      },
      account_route_id: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SideshiftQuotes');
  }
};