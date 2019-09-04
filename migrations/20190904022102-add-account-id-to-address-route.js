'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('address_routes', 'account_id', {
        type: Sequelize.INTEGER
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('address_routes', 'account_id');
  }
};
