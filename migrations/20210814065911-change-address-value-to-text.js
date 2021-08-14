'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.alterColumn('payment_options', 'address', { type: Sequelize.TEXT });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.alterColumn('payment_options', 'address', { type: Sequelize.STRING });
  }
};
