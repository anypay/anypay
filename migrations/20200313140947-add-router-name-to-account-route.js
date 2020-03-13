'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('AccountRoutes', 'router_name', {

      type: Sequelize.STRING
      
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('AccountRoutes', 'router_name');

  }

};
