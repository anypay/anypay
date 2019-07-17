'use strict';
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // temporary until we can use some real geographic types
    await queryInterface.addColumn('accounts', 'state', {
      type: Sequelize.STRING
    });

    // temporary until we can use some real geographic types
    await queryInterface.addColumn('accounts', 'city', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('accounts', 'country', {
      type: Sequelize.STRING
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('accounts', 'city');

    await queryInterface.removeColumn('accounts', 'state');

    await queryInterface.removeColumn('accounts', 'country');

  }
}
