'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('cashback_customer_payments', 'dash_back_merchant_id', 'cashback_merchant_id')
    return queryInterface.renameColumn('cashback_merchant_payments', 'dash_back_merchant_id', 'cashback_merchant_id')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('cashback_customer_payments', 'cashback_merchant_id', 'dash_back_merchant_id')
    return queryInterface.renameColumn('cashback_merchant_payments', 'cashback_merchant_id', 'dash_back_merchant_id')
  }
};
