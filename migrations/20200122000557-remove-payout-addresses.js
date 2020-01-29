'use strict';

let columnsToRemove = [
  "dash_payout_address",
  "bitcoin_payout_address",
  "bitcoin_cash_address",
  "litecoin_address",
  "litecoin_enabled",
  "bitcoin_cash_enabled",
  "dogecoin_address",
  "dogecoin_enabled",
  "ethereum_address",
  "ripple_address",
  "zcash_t_address",
  "lightning_uri"
]

module.exports = {
  up: async (queryInterface, Sequelize) => {

    for (let i =0; i < columnsToRemove.length; i++) {

      let column = columnsToRemove[i];

      await queryInterface.removeColumn('accounts', column);
    }
    

  },

  down: async (queryInterface, Sequelize) => {


  }
};
