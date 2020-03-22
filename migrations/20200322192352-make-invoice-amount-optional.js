'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: false
    });

  }
};
