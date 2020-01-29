'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('ach_batches', 'batch_id', {
      allowNull: true,
      type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn('ach_batches', 'effective_date', {
      allowNull: true,
      type: Sequelize.DATE
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('ach_batches', 'batch_id', {
      allowNull: false,
      type: Sequelize.INTEGER
    });
    await queryInterface.changeColumn('ach_batches', 'effective_date', {
      allowNull: false,
      type: Sequelize.DATE
    });

  }
};
