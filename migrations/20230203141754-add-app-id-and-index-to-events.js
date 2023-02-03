'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('events', 'app_id', { type: Sequelize.INTEGER });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('events', 'app_id')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
