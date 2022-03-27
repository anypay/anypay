'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('events', 'namespace', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('events', 'error', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('events', 'namespace')
    await queryInterface.removeColumn('events', 'error')
  }
};
