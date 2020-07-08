'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('accounts', 'dash_text_enabled', {
      type: Sequelize.STRING,    
      defaultValue: false 
    });

  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('accounts', 'dash_text_enabled');

  }
};
