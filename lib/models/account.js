const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const Joi = require('joi');
const bchaddr = require('../bitcoin_cash/bitcore').bchaddr;

module.exports = function(sequelize, Sequelize) {
  const Account = sequelize.define('account', {
    uid: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: true
    },
    stub: {
      type: Sequelize.STRING,
      allowNull: true
    },
    is_admin: {
      type: Sequelize.BOOLEAN
    },
    tipjar_enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    allow_cashback_amount: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    business_name: {
      type: Sequelize.STRING
    },
    physical_address: {
      type: Sequelize.STRING
    },
    latitude: {
      type: Sequelize.STRING
    },
    longitude: {
      type: Sequelize.STRING
    },
    denomination: {
      type: Sequelize.STRING,
      defaultValue: 'USD'
    },
    image_url: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    watch_address_webhook_url: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    ambassador_id: {
      type: Sequelize.INTEGER
    }
  }, {

    hooks: {

      beforeCreate: (account, options) => {

        account.uid = uuid.v4();

        if (account.email) {

          account.email = account.email.toLowerCase();

        }

      }

    }

  });

  return Account;
}

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
  denomination: Joi.string(),
  image_url: Joi.string(),
  stub: Joi.string()
}).label('Account');

