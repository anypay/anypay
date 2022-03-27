'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('events', 'event', 'type');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('events', 'type', 'event');
  }
};
