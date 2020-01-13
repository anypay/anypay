'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('vending_transactions', 'additional_output_strategy_id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('vending_transactions', 'additional_output_usd_paid', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('vending_transactions', 'additional_output_bch_paid', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('vending_transactions', 'additional_output_hash', {
      type: Sequelize.STRING
    });


  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('vending_transactions', 'additional_output_hash');
    await queryInterface.removeColumn('vending_transactions', 'additional_output_strategy_id');
    await queryInterface.removeColumn('vending_transactions', 'additional_output_usd_paid');
    await queryInterface.removeColumn('vending_transactions', 'additional_output_bch_paid');

  }
};
