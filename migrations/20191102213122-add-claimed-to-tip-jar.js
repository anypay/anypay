'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('tipjars', 'claimed', { 
        type: Sequelize.BOOLEAN,
        defaultValue: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('tipjars', 'uri');
  }
}
