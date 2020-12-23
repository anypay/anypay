'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('ach_batches', 'batch_id', {
      type: Sequelize.STRING
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
