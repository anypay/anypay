'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'router', {
      type: Sequelize.STRING,
      defaultValue: 'anypay'
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('invoices', 'router');
  }
};
