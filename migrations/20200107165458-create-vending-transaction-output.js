'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vending_transaction_outputs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vending_transaction_id: {
        type: Sequelize.INTEGER
      },
      strategy_id: {
        type: Sequelize.INTEGER
      },
      strategy_index: {
        type: Sequelize.INTEGER
      },
      isKioskCustomer: {
        type: Sequelize.BOOLEAN
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING
      },
      output_index: {
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.DECIMAL
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
    return queryInterface.dropTable('vending_transaction_outputs');
  }
};
