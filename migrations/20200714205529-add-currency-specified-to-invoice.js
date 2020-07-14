'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  
    return queryInterface.addColumn('invoices', 'currency_specified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('invoices', 'currency_specified');

  }
};
