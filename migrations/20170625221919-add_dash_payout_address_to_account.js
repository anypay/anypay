'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
  
    return queryInterface.addColumn('accounts', 'dash_payout_address', {
      type: Sequelize.STRING
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('accounts', 'dash_payout_address');
  }
};
