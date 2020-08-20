'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('payments')

    await queryInterface.createTable('payments', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      txhex: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      txjson: {
        type: Sequelize.JSON,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      invoice_uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      payment_option_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments') 
  }
};
