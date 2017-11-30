'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('accounts', 'dogecoin_address', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('accounts', 'dogecoin_enabled', {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'dogecoin_address');

    await queryInterface.removeColumn('accounts', 'dogecoin_enabled');
  }
};
