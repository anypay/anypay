'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('invoices', 'bank_account_id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('invoices', 'ach_batch_id', {
      type: Sequelize.INTEGER
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('invoices', 'ach_batch_id');
    await queryInterface.removeColumn('invoices', 'bank_account_id');

  }
}
