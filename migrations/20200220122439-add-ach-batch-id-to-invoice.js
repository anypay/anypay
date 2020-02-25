'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'convert_to_bank', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('accounts', 'convert_to_bank', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'convert_to_bank');
    await queryInterface.removeColumn('accounts', 'convert_to_bank');

  }
};
