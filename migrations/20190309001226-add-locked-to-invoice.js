'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('invoices', 'locked', { type: Sequelize.BOOLEAN });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('invoices', 'locked');
  }
};
