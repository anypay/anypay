'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('payment_options', 'currency_name', { type: Sequelize.STRING });
     await queryInterface.addColumn('payment_options', 'currency_logo_url', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('payment_options', 'currency_name');
     await queryInterface.removeColumn('payment_options', 'currency_logo_url');
  }
};
