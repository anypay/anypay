'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('payments', 'txjson', {
       type: Sequelize.JSON,
       allowNull: true
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.changeColumn('payments', 'txjson', {
       type: Sequelize.JSON,
       allowNull: false
     });
  }
};
