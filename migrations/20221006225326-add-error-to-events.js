'use strict';

module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('events', 'error', { type: Sequelize.BOOLEAN });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('events', 'error')

  }

};
