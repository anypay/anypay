const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const Joi = require('joi');
const bchaddr = require('bchaddrjs');

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
    authenticator_secret: {
      type: Sequelize.STRING
    },
    watch_address_webhook_url: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
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
  denomination: Joi.string(),
  business_name: Joi.string(),
  physical_address: Joi.string(),
  latitude: Joi.string(),
  longitude: Joi.string(),
  image_url: Joi.string(),
  stub: Joi.string()
}).label('Account');

