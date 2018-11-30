'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('invoices', 'redirect_url', {
      
      type: Sequelize.STRING
    
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('invoices', 'redirect_url');

  }
};
