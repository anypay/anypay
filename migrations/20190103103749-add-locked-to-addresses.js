'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('addresses', 'locked', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }); 
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('addresses', 'locked');

  }
};
