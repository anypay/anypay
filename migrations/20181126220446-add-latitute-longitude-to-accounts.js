'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // temporary until we can use some real geographic types
    await queryInterface.addColumn('accounts', 'latitude', {
      type: Sequelize.STRING
    });

    // temporary until we can use some real geographic types
    await queryInterface.addColumn('accounts', 'longitude', {
      type: Sequelize.STRING
    });

  },

  down: (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'latitude');

    await queryInterface.removeColumn('accounts', 'longitude');

  }
};
