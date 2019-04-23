'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addColumn('accounts', 'allow_cashback_amount', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeColumn('accounts', 'allow_cashback_amount');

  }
};
