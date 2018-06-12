'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.addColumn('dash_back_merchants', 'merchant_percent', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('dash_back_merchants', 'merchant_amount', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('dash_back_merchants', 'merchant_strategy', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('dash_back_merchants', 'customer_percent', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('dash_back_merchants', 'customer_amount', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.addColumn('dash_back_merchants', 'customer_strategy', {
      type: Sequelize.STRING
    });
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.removeColumn('dash_back_merchants', 'merchant_percent');
    await queryInterface.removeColumn('dash_back_merchants', 'merchant_amount');
    await queryInterface.removeColumn('dash_back_merchants', 'merchant_strategy');

    await queryInterface.removeColumn('dash_back_merchants', 'customer_percent');
    await queryInterface.removeColumn('dash_back_merchants', 'customer_amount');
    await queryInterface.removeColumn('dash_back_merchants', 'customer_strategy');
  }
};
