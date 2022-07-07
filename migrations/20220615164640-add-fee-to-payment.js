'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('payments', 'total_input', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('payments', 'total_output', {
      type: Sequelize.INTEGER
    });

    await queryInterface.addColumn('payments', 'network_fee', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('payments', 'total_input')

    await queryInterface.removeColumn('payments', 'total_output')

    await queryInterface.removeColumn('payments', 'network_fee')

  }
};
