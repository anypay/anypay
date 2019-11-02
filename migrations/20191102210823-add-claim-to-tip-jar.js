'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('tipjars', 'claim_txid', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('tipjars', 'claim_alias', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('tipjars', 'claim_address', {
      type: Sequelize.STRING
    });

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.removeColumn('tipjars', 'claim_txid');
    await queryInterface.removeColumn('tipjars', 'claim_alias');
    await queryInterface.removeColumn('tipjars', 'claim_address');

  }
}
