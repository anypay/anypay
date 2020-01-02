'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('grab_and_go_items', 'square_variation_id', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('grab_and_go_invoices', 'square_order_id', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('square_oauth_credentials', 'square_merchant_id', {
      type: Sequelize.STRING
    });

  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('grab_and_go_items', 'square_variation_id');
    await queryInterface.removeColumn('grab_and_go_invoices', 'square_order_id');
    await queryInterface.removeColumn('square_oauth_credentials', 'square_merchant_id');

  }
};
