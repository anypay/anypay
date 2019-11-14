'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payroll_payments', 'payroll_batch_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('payroll_payments', 'error', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payroll_payments', 'payroll_batch_id');
    await queryInterface.removeColumn('payroll_payments', 'error');
  }
};
