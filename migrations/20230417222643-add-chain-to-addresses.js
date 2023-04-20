'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('addresses', 'chain', { type: Sequelize.STRING });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('addresses', 'chain');
  }
};
