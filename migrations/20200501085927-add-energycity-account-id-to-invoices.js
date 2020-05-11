'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('invoices', 'energycity_account_id', {
      type: Sequelize.INTEGER });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('invoices', 'energycity_account_id');
  }
};
