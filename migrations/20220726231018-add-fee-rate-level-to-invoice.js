'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'fee_rate_level', {
      type: Sequelize.STRING,
      defaultValue: 'fastestFee'
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('invoices', 'fee_rate_level')
  }
};
