'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('grab_and_go_items', 'square_catalog_object_id', {
        type: Sequelize.STRING
      });
  },

  down: (queryInterface, Sequelize) => {

      return queryInterface.removeColumn('grab_and_go_items', 'square_catalog_object_id');
  }
};
