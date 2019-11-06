'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('accounts', 'bank_account_id', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('accounts', 'ach_enabled', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('accounts', 'ach_enabled');
    await queryInterface.removeColumn('accounts', 'bank_account_id');

  }
}
