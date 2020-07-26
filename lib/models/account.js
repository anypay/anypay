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
    email_valid: {
      type: Sequelize.STRING,
      defaultValue: true
    },
    google_place_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: true
    },
    should_settle: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    dash_text_enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    settlement_strategy: {
      type: Sequelize.STRING,
      defaultValue: null
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
    website_url: {
      type: Sequelize.STRING,
      allowNull: true
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
  denomination: Joi.string(),
  image_url: Joi.string(),
  stub: Joi.string()
}).label('Account');

