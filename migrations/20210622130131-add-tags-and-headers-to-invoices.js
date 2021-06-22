'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('invoices', 'tags', {
       type: Sequelize.ARRAY(Sequelize.STRING)
     });
     await queryInterface.addColumn('invoices', 'headers', {
       type: Sequelize.JSON
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('invoices', 'tags');
     await queryInterface.removeColumn('invoices', 'headers');
  }
};
