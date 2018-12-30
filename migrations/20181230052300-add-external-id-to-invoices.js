'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'external_id', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'external_id');

  }
};
