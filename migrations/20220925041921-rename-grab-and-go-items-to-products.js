'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.renameTable('grab_and_go_items', 'products')

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.renameTable('products', 'grab_and_go_items')

  }
};
