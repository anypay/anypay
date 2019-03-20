'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.renameTable('dash_back_merchants', 'cashback_merchants');

    await queryInterface.renameTable('dash_back_customer_payments', 'cashback_customer_payments');

    await queryInterface.renameTable('dash_back_merchant_payments', 'cashback_merchant_payments');

    await queryInterface.addColumn('cashback_customer_payments', 'currency', Sequelize.STRING);

    await queryInterface.addColumn('cashback_merchant_payments', 'currency', Sequelize.STRING);

    await queryInterface.sequelize.query("update cashback_customer_payments set currency='DASH';");

    await queryInterface.sequelize.query("update cashback_merchant_payments set currency='DASH';");

  },

  down: async function (queryInterface, Sequelize) {

    await queryInterface.renameColumn('cashback_merchants', 'dash_back_merchants');

    await queryInterface.renameColumn('cashback_customer_payments', 'dash_back_customer_payments');

    await queryInterface.renameColumn('cashback_merchant_payments', 'dash_back_merchant_payments');

    await queryInterface.removeColumn('dash_back_customer_payments', 'currency');

    await queryInterface.removeColumn('dash_back_merchant_payments', 'currency');

  }
};
