'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('invoices', 'webhook_url', {
      
      type: Sequelize.STRING
    
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('invoices', 'webhook_url');

  }
};
