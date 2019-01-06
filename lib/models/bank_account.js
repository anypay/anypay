'use strict';
module.exports = (sequelize, DataTypes) => {
  var BankAccount = sequelize.define('bank_account', {
    beneficiary_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beneficiary_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    routing_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    beneficiary_account_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_id: {
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
  return BankAccount;
};
