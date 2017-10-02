'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'bitcoin_payout_address',
    Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('accounts', 'bitcoin_payout_address');
  }
};
