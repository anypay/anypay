'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('vending_machines', 'additional_output_strategy_id', {
      type: Sequelize.INTEGER
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('vending_machines', 'additional_output_strategy_id');

  }
}
