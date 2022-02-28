'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Webhooks', 'account_id', {
      type: Sequelize.INTEGER
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Webhooks', 'account_id')
  }
};
