'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('generalbytes_sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      terminal_sn: {
        type: Sequelize.STRING
      },
      server_time: {
        type: Sequelize.DATE
      },
      terminal_time: {
        type: Sequelize.DATE
      },
      local_transaction_id: {
        type: Sequelize.STRING
      },
      remote_transaction_id: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      cash_amount: {
        type: Sequelize.INTEGER
      },
      cash_currency: {
        type: Sequelize.STRING
      },
      crypto_amount: {
        type: Sequelize.DECIMAL
      },
      crypto_currency: {
        type: Sequelize.STRING
      },
      used_discount: {
        type: Sequelize.STRING
      },
      actual_discount: {
        type: Sequelize.DECIMAL
      },
      destination_address: {
        type: Sequelize.STRING
      },
      related_remote_transaction_id: {
        type: Sequelize.STRING
      },
      identity: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      transaction_detail: {
        type: Sequelize.STRING
      },
      transaction_note: {
        type: Sequelize.STRING
      },
      rate_including_fee: {
        type: Sequelize.DECIMAL
      },
      rate_without_fee: {
        type: Sequelize.DECIMAL
      },
      fixed_transaction_fee: {
        type: Sequelize.DECIMAL
      },
      expected_profit_percent_setting: {
        type: Sequelize.DECIMAL
      },
      expected_profit_value: {
        type: Sequelize.DECIMAL
      },
      crypto_setting_name: {
        type: Sequelize.STRING
      },
      identity_first_name: {
        type: Sequelize.STRING
      },
      identity_id_card_number: {
        type: Sequelize.STRING
      },
      identity_phone_number: {
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
    return queryInterface.dropTable('generalbytes_sales');
  }
};
