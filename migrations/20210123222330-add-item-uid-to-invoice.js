'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'item_uid', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invoices', 'item_uid')
  }
};
