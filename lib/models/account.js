const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
var bchaddr = require('bchaddrjs');

const Account = sequelize.define('account', {
  uid: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: Sequelize.STRING
  },
  dash_payout_address: {
    type: Sequelize.STRING
  },
  bitcoin_payout_address: {
    type: Sequelize.STRING
  },
  bitcoin_cash_address: {
    type: Sequelize.STRING,
    validate: {
      isBitcoinAddress(value) {
        console.log('validate bitcoin address', value);
        if (!(bchaddr.isLegacyAddress(value) || bchaddr.isCashAddress(value))) {
          throw new Error(`invalid bitcoin cash address: ${value}`);
        }
      }
    }
  },
  bitcoin_cash_enabled: {
    type: Sequelize.BOOLEAN
  },
  litecoin_address: {
    type: Sequelize.STRING
  },
  litecoin_enabled: {
    type: Sequelize.BOOLEAN
  },
  dogecoin_address: {
    type: Sequelize.STRING
  },
  dogecoin_enabled: {
    type: Sequelize.BOOLEAN
  }
}, {
  hooks: {
    beforeCreate: (account, options) => {
      account.uid = uuid.v4();
      account.email = account.email.toLowerCase();
    }
  }
});

module.exports = Account;

