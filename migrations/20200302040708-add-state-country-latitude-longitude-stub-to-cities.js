'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('cities', 'country', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('cities', 'stub', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('cities', 'latitude', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('cities', 'longitude', {
      type: Sequelize.DECIMAL
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('cities', 'country');
    //await queryInterface.removeColumn('cities', 'stub');
    //await queryInterface.removeColumn('cities', 'latitude');
    //await queryInterface.removeColumn('cities', 'longitude');

  }
};
