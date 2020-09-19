'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.addColumn('ach_batches', 'payments_date', { type: Sequelize.DATE });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('ach_batches', 'payments_date');
  }
};
