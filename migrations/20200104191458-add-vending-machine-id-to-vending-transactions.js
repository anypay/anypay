'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('vending_transactions', 'vending_machine_id', {

      type: Sequelize.INTEGER

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('vending_transactions', 'vending_machine_id');

  }
};
