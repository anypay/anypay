'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('invoices', 'expiry', {

      type: Sequelize.DATE,

      allowNull: true

    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('invoices', 'expiry');
  }
};
