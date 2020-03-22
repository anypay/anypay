'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.changeColumn('invoices', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('invoices', 'address', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
