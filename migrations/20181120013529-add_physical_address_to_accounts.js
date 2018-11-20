'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('accounts', 'physical_address', {

      type: Sequelize.STRING,

      allowNull: true

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'physical_address');

  }
};
