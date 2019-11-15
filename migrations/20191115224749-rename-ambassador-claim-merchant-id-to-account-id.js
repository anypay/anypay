'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('ambassador_claims', 'merchant_id', 'merchant_account_id')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('ambassador_claims', 'merchant_account_id', 'merchant_id')
  }
};
