'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('accounts', 'customer_pays_ambassador', {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('accounts', 'customer_pays_ambassador');
  }
};
