'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('products', 'recurring', { type: Sequelize.BOOLEAN });
    await queryInterface.addColumn('products', 'period', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('products', 'recurring');
    await queryInterface.removeColumn('products', 'period');
  }
};
