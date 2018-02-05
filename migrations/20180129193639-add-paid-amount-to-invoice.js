'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'paid_amount', {
      type: Sequelize.DECIMAL
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'paid_amount');
  }
};
