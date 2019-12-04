'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('vending_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      terminal_id: {
        type: Sequelize.STRING
      },
      server_time: {
        type: Sequelize.DATE
      },
      terminal_time: {
        type: Sequelize.DATE
      },
      localtid: {
        type: Sequelize.STRING
      },
      remotetid: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      cash_amount: {
        type: Sequelize.DECIMAL
      },
      cash_currency: {
        type: Sequelize.STRING
      },
      crypto_currency: {
        type: Sequelize.STRING
      },
      crypto_amount: {
        type: Sequelize.DECIMAL
      },
      crypto_address: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.STRING
      },
      exchange_strategy_used: {
        type: Sequelize.STRING
      },
      rate_source_price: {
        type: Sequelize.DECIMAL
      },
      fixed_transaction_fee: {
        type: Sequelize.DECIMAL
      },
      expected_profit_setting: {
        type: Sequelize.STRING
      },
      expected_profit_value: {
        type: Sequelize.DECIMAL
      },
      name_of_crypto_setting_used: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('transactions');
  }
};
