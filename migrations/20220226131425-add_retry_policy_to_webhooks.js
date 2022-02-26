'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.addColumn('Webhooks', 'retry_policy', {

       type: Sequelize.STRING,

       defaultValue: 'no_retry'

     });

  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.removeColumn('Webhooks', 'retry_policy')
  }
};
