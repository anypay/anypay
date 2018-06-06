const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const Joi = require('joi');
const bchaddr = require('bchaddrjs');

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
  },
  ripple_address: {
    type: Sequelize.STRING
  },
  zcash_t_address: {
    type: Sequelize.STRING
  },
}, {
  hooks: {
    beforeCreate: (account, options) => {
      account.uid = uuid.v4();
      account.email = account.email.toLowerCase();
    }
  }
});

module.exports = Account;
module.exports.Account = Account;

module.exports.Credentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}).label('Credentials');

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  email: Joi.string().required(),
  password_hash: Joi.string().required(),
  dash_payout_address: Joi.string(),
  bitcoin_payout_address: Joi.string(),
  bitcoin_cash_address: Joi.string(),
  bitcoin_cash_enabled: Joi.boolean(),
  litecoin_address: Joi.string(),
  litecoin_enabled: Joi.boolean(),
  dogecoin_address: Joi.string(),
  dogecoin_enabled: Joi.boolean(),
  ripple_address: Joi.string(),
}).label('Account');
