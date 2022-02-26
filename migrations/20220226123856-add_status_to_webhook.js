'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.addColumn('Webhooks', 'status', {

       type: Sequelize.STRING,

       defaultValue: 'pending'

     });

  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.removeColumn('Webhooks', 'status')
  }
};
