'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('address_routes', 'is_static', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('address_routes', 'is_static', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

  }
};
