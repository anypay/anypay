'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('invoices', 'invoice_currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('invoices', 'invoice_currency', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
