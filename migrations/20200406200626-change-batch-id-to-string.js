'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('ach_batches', 'batch_id', {
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('ach_batches', 'batch_id', {
      type: Sequelize.INTEGER
    });
  }
};
