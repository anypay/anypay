
module.exports = function(sequelize, Sequelize) {

  var CashbackCustomerPayment = sequelize.define('CashbackCustomerPayment', {
    invoice_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: true
    },
    amount: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    transaction_hash: {
      type: Sequelize.STRING,
      allowNull: true
    },
    error: {
      type: Sequelize.STRING,
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    cashback_merchant_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'cashback_customer_payments'
  });
 
  return CashbackCustomerPayment;

}

