var sequelize = require('../database');
var Sequelize = require('sequelize');

var PaymentForward = sequelize.define('PaymentForward', {
  input_address: Sequelize.DataTypes.STRING,
  input_currency: Sequelize.DataTypes.STRING,
  output_address: Sequelize.DataTypes.STRING,
  output_currency: Sequelize.DataTypes.STRING,
  expired: Sequelize.DataTypes.BOOLEAN
}, {
  tableName: 'payment_forwards',
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  }
});

module.exports = PaymentForward;
