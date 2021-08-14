'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('payment_options', 'address', { type: Sequelize.TEXT });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('payment_options', 'address', { type: Sequelize.STRING });
  }
};
