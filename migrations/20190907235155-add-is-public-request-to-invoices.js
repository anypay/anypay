'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'is_public_request', {

      type: Sequelize.BOOLEAN,

      defaultValue: false

    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'is_public_request');

  }
};
