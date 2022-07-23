'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    queryInterface.addColumn('invoices', 'memo', {
      type: Sequelize.STRING,
      allowNull: true
    })
  },

  down: async (queryInterface, Sequelize) => {

    queryInterface.removeColumn('invoices', 'memo')
  }
};
