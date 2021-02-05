'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payments', 'wallet', { type: Sequelize.STRING });
    await queryInterface.addColumn('payments', 'ip_address', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payments', 'wallet');
    await queryInterface.removeColumn('payments', 'ip_address');
  }
};
