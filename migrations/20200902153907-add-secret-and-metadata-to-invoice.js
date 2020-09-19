'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('invoices', 'secret', {
       type: Sequelize.STRING
     });
     await queryInterface.addColumn('invoices', 'metadata', {
       type: Sequelize.JSON
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'secret')
     await queryInterface.removeColumn('invoices', 'metadata')
  }
};
