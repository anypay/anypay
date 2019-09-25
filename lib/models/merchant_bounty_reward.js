'use strict';

module.exports = function(sequelize, Sequelize) {

  var MerchantBountyReward = sequelize.define('MerchantBountyReward', {
    merchant_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ambassador_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    payment_currency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    payment_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue("payment_amount"));
      }
    },
    denomination_currency: {
      type: Sequelize.STRING,
      allowNull: false
    },
    denomination_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue("denomination_amount"));
      }
    },
    payment_hash: {
      type: Sequelize.STRING,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    tableName: 'merchant_bounty_rewards'
  });

  return MerchantBountyReward
}

