var sequelize = require('../database');
var Sequelize = require('sequelize');

var PaymentForwardOutputPayment = sequelize.define('PaymentForwardOutputPayment', {
  payment_forward_input_payment_id: Sequelize.DataTypes.INTEGER,
  payment_forward_id: Sequelize.DataTypes.INTEGER,
  amount: Sequelize.DataTypes.DECIMAL,
  txid: Sequelize.DataTypes.STRING
}, {

  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  },

  tableName: 'payment_forward_output_payments'
});

module.exports = PaymentForwardOutputPayment;

