'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PaymentSubmissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_uid: {
        type: Sequelize.STRING
      },
      txhex: {
        type: Sequelize.TEXT
      },
      currency: {
        type: Sequelize.STRING
      },
      headers: {
        type: Sequelize.JSON
      },
      wallet: {
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
    await queryInterface.dropTable('PaymentSubmissions');
  }
};
