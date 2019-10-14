'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('coins', 'precision', { type: Sequelize.INTEGER });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('coins', 'precision');
  }
};
