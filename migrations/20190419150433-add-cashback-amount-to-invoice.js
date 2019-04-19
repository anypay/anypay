'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('invoices', 'cashback_amount', {

      type: Sequelize.DECIMAL,

      allowNull: true

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('invoices', 'cashback_amount');
  }
};
