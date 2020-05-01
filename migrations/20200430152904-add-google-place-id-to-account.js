'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('accounts', 'google_place_id', { type: Sequelize.STRING });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('accounts', 'google_place_id');
  }
};
