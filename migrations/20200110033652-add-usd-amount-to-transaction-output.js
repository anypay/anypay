'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('vending_transaction_outputs', 'usd_amount', {
      type: Sequelize.DECIMAL
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('vending_transaction_outputs', 'usd_amount');

  }
}
