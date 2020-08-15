'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('payment_options', 'fee', {
      type: Sequelize.INTEGER,
      allowNull: true
    })

    await queryInterface.addColumn('payment_options', 'outputs', {
      type: Sequelize.JSON,
      allowNull: true
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('payment_options', 'fee')
    await queryInterface.removeColumn('payment_options', 'outputs')
  }
};
