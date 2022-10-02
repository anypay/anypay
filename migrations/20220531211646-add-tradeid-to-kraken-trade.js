'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('KrakenTrades', 'tradeid', { type: Sequelize.STRING });
    await queryInterface.addColumn('KrakenTrades', 'account_id', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('KrakenTrades', 'date', { type: Sequelize.DATE });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('KrakenTrades', 'tradeid');
    await queryInterface.removeColumn('KrakenTrades', 'account_id');
    await queryInterface.removeColumn('KrakenTrades', 'date');
  }
};
