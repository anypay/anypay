'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ach_batches', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: false 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('ach_batches', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: true 
    });
  }
};
