'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('PaymentRequests', 'webpage_url', {
       type: Sequelize.STRING
     });
     await queryInterface.addColumn('PaymentRequests', 'uri', {
       type: Sequelize.STRING
     });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('PaymentRequests', 'webpage_url')
     await queryInterface.removeColumn('PaymentRequests', 'uri')
  }
};
