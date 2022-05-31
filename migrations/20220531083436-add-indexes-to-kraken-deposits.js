'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addIndex('KrakenDeposits', {
      fields: ['account_id', 'txid'],
      name: 'kraken_deposits_account_id_txid',
      unique: false
    });

    await queryInterface.addIndex('KrakenDeposits', {
      fields: ['txid'],
      name: 'kraken_deposits_txid',
      unique: false
    });

    await queryInterface.addIndex('KrakenDeposits', {
      fields: ['account_id'],
      name: 'kraken_deposits_account_id',
      unique: false
    });

  },

  down: async (queryInterface, Sequelize) => {


  }

};
