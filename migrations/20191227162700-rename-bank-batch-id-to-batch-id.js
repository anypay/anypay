'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //return queryInterface.renameColumn('ach_batches', 'bank_batch_id', 'batch_id');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('ach_batches', 'batch_id', 'bank_batch_id');
  }
};
