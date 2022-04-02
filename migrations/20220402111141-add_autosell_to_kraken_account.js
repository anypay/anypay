'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('KrakenAccounts', 'autosell', {

      type: Sequelize.ARRAY(Sequelize.STRING),

      allowNull: false,

      defaultValue: []

    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('KrakenAccounts', 'autosell');

  }
};
