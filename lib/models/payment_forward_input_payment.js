
module.exports = function(sequelize, Sequelize) {
  var PaymentForwardInputPayment = sequelize.define('PaymentForwardInputPayment', {
    payment_forward_id: Sequelize.DataTypes.INTEGER,
    txid: Sequelize.DataTypes.STRING,
    amount: Sequelize.DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'payment_forward_input_payments'
  });

  return PaymentForwardInputPayment
}

