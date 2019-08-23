'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {

      await queryInterface.addConstraint('invoices', ['hash'], {
        type: 'unique',
        name: 'unique_invoice_hash_constraint'
      });
    } catch(error) {
      console.log(error);
    }

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeConstraint('invoices', 'unique_invoice_hash');

  }
};
