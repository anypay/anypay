'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('invoices', 'amount_paid', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('invoices', 'amount_paid', {
      type: Sequelize.DECIMAL
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('invoices', 'amount_paid');
    await queryInterface.removeColumn('invoices', 'amount_paid');

  }
};
