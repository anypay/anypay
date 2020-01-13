'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('vending_transaction_outputs', 'address', {
      type: Sequelize.STRING
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('vending_transaction_outputs', 'address');

  }
}
