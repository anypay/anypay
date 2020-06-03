'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('vending_machines', 'payout_address', { type: Sequelize.STRING });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.remove_column('vending_machines', 'payout_address');
  }
};
