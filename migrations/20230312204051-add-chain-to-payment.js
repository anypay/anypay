'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('payments', 'chain', { type: Sequelize.STRING });
    await queryInterface.addColumn('payment_options', 'chain', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('payments', 'chain');
     await queryInterface.removeColumn('payment_options', 'chain');
  }
};
