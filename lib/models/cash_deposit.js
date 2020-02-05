'use strict';
module.exports = (sequelize, DataTypes) => {
  var CashDeposit = sequelize.define('CashDeposit', {
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CashDeposit;
};
