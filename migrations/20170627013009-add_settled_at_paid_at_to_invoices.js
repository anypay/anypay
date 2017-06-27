'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('invoices', 'settledAt', {
      type: Sequelize.DATE
    })
    .then(() => {
      return queryInterface.addColumn('invoices', 'paidAt', {
        type: Sequelize.DATE
      })
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('invoices', 'settledAt').then(() => {
      queryInterface.removeColumn('invoices', 'paidAt');
    });
  }
};
