'use strict';

module.exports = {

  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('accounts', 'is_admin', {

      type: Sequelize.BOOLEAN,

      defaultValue: false

    });
  
  },

  down: async function (queryInterface, Sequelize) {

    queryInterface.removeColumn('accounts', 'is_admin');

  }

};

