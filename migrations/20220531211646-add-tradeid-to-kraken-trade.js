'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('KrakenTrades', 'tradeid', { type: Sequelize.STRING });
    await queryInterface.addColumn('KrakenTrades', 'account_id', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('KrakenTrades', 'tradeid');
    await queryInterface.removeColumn('KrakenTrades', 'account_id');
  }
};
