'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('payments', 'account_id', {
       type: Sequelize.INTEGER
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('payments', 'account_id')
  }
};
