'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('accounts', 'litecoin_address', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('accounts', 'litecoin_enabled', {
      type: Sequelize.BOOLEAN
    });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'litecoin_address');

    await queryInterface.removeColumn('accounts', 'litecoin_enabled');
  }
};
