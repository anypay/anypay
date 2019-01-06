'use strict';
module.exports = (sequelize, DataTypes) => {
  var BankAccount = sequelize.define('bank_account', {
    beneficiary_name: DataTypes.STRING,
    beneficiary_address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    routing_number: DataTypes.STRING,
    beneficiary_account_number: DataTypes.STRING,
    account_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BankAccount;
};
