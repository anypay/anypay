'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addColumn('invoices', 'cashback_amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });

  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeColumn('invoices', 'cashback_amount');

  }
};
