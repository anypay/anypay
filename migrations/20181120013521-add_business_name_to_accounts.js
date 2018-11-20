'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('accounts', 'business_name', {

      type: Sequelize.STRING,

      allowNull: true

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'business_name');

  }
};
