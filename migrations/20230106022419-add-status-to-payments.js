'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('payments', 'status', { type: Sequelize.STRING, defaultValue: 'confirming' })

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('payments', 'status')

  }
};
