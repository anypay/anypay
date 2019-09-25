'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('accounts', 'stub', {

      type: Sequelize.STRING

    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'stub');

  }
};
