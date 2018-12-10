'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'complete', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    await queryInterface.addColumn('invoices', 'completed_at', {
      type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'complete');
    await queryInterface.removeColumn('invoices', 'completed_at');

  }
};
