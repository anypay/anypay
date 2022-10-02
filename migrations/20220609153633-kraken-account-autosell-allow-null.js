'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('KrakenAccounts', 'autosell', {

      type: Sequelize.ARRAY(Sequelize.STRING),

      allowNull: true,

      defaultValue: []

    });
  },

  down: async (queryInterface, Sequelize) => {

  }
};
