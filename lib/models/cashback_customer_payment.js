
module.exports = function(sequelize, Sequelize) {

  var CashbackCustomerPayment = sequelize.define('CashbackCustomerPayment', {
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
      allowNull: true
    },
    amount: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    address: {
      type: Sequelize.STRING,
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

