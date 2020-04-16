'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('ach_batches', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return; 
  }
};
