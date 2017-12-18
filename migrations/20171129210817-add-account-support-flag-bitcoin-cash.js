'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('accounts', 'bitcoin_cash_enabled', {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'bitcoin_cash_enabled');
  }
};
