'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('vending_transactions', 'additional_output_error', {
      type: Sequelize.STRING
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('vending_transactions', 'additional_output_error', {
      type: Sequelize.STRING
    });

  }

};
