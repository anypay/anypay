'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('accounts', 'ambassador_id', {

      type: Sequelize.INTEGER,

      allowNull: true

    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'ambassador_id');

  }

};
