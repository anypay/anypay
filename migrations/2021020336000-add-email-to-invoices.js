'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('invoices', 'email', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'email');
  }
};

