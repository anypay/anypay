'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('invoices', {
      fields: ['account_id'],
      name: 'invoice_account_id',
      unique: false
    });
  },

  down: async (queryInterface, Sequelize) => {

  }
};
