'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('invoices', 'business_id', { type: Sequelize.STRING });
     await queryInterface.addColumn('invoices', 'location_id', { type: Sequelize.STRING });
     await queryInterface.addColumn('invoices', 'register_id', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'business_id');
     await queryInterface.removeColumn('invoices', 'location_id');
     await queryInterface.removeColumn('invoices', 'register_id');
  }
};
