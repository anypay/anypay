'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('invoices', 'invoice_amount_paid', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('invoices', 'denomination_amount_paid', {
      type: Sequelize.DECIMAL
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('invoices', 'invoice_amount_paid');
    await queryInterface.removeColumn('invoices', 'denomination_amount_paid');

  }
};
