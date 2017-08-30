'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
		return queryInterface.addColumn('invoices', 'dollar_amount', { type: Sequelize.DECIMAL });
  },

  down: function (queryInterface, Sequelize) {
		return queryInterface.removeColumn('invoices', 'dollar_amount');
  }
};
