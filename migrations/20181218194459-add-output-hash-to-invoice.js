'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'output_hash', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('invoices', 'output_address', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('invoices', 'output_currency', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('invoices', 'output_amount', {
      type: Sequelize.DECIMAL
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'output_hash');

    await queryInterface.removeColumn('invoices', 'output_address');

    await queryInterface.removeColumn('invoices', 'output_currency');

    await queryInterface.removeColumn('invoices', 'output_amount');

  }
};
