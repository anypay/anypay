'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('invoices', 'ach_batch_id', {
        type: Sequelize.INTEGER,
        defaultValue: null
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('invoices', 'ach_batch_id');
  }
};
