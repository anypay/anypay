'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.addColumn('addresses', 'nonce', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('addresses', 'nonce');
  }
};
