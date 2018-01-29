'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'blockcypher_webhook_uid', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'blockcypher_webhook_uid');
  }
};
