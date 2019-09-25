'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('accounts', 'watch_address_webhook_url', {
      type: Sequelize.STRING
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'watch_address_webhook_url');
  }
};
