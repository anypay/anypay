'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('accounts', 'email_valid', {

      type: Sequelize.STRING,

      defaultValue: true

    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'email_valid');

  }

};
