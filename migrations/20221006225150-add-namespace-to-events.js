'use strict';

module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('events', 'namespace', { type: Sequelize.STRING });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('events', 'namespace')

  }

};
