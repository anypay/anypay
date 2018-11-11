'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('dash_back_merchants', 'ambassador_id', {

      type: Sequelize.INTEGER

    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('dash_back_merchants', 'ambassador_id');

  }
};
