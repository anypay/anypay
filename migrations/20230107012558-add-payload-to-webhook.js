'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Webhooks', 'payload', { type: Sequelize.JSON, allowNull: false, defaultValue: {} })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Webhooks', 'payload')
  }
};
