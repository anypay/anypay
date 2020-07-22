'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('coins', 'supported', {

      type: Sequelize.BOOLEAN,

      defaultValue: false

    });

  },

  down: async function (queryInterface, Sequelize) {

    queryInterface.removeColumn('accounts', 'supported');

  }
};
