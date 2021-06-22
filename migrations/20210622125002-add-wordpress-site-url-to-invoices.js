'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('invoices', 'wordpress_site_url', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'wordpress_site_url');
  }
};
