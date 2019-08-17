'use strict';

module.exports = function(sequelize, Sequelize) {
  var CashbackMerchantPayments = sequelize.define('CashbackMerchantPayment', {
    cashback_merchant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    invoice_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    transaction_hash: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'cashback_merchant_payments'
  });

  return CashbackMerchantPayments;
}

