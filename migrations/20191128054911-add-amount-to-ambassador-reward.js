'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('ambassador_rewards', 'amount', { type: Sequelize.DECIMAL });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('ambassador_rewards', 'amount');
  }
};
