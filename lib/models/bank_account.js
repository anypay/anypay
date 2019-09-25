'use strict';
module.exports = (sequelize, Sequelize) => {
  var BankAccount = sequelize.define('bank_account', {
    beneficiary_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    beneficiary_address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false
    },
    zip: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    routing_number: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    beneficiary_account_number: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    account_id: {
      type: Sequelize.DataTypes.INTEGER,
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
