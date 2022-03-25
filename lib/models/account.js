const uuid = require('uuid');
import * as Joi from '@hapi/joi'

import { log } from '../log'

import { setPositionFromLatLng } from '../accounts'

import * as stub from '../stub'

module.exports = function(sequelize, Sequelize) {
  const Account = sequelize.define('account', {
    uid: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    },
    registration_geolocation: {
      type: Sequelize.JSON,
      allowNull: true
    },
    registration_ip_address: {
      type: Sequelize.STRING,
      allowNull: true
    },
    position: Sequelize.GEOMETRY('POINT', 4326),
    email_valid: {
      type: Sequelize.STRING,
      defaultValue: true
    },
    description: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING,
      allowNull: true
    },
    state: {
      type: Sequelize.STRING,
      allowNull: true
    },
    country: {
      type: Sequelize.STRING,
      allowNull: true
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
    webhook_url: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
  }, {

    hooks: {

      afterUpdate: async (account, options) => {

        try {

          if (options.fields.includes('business_name')) {

            let record = await Account.findOne({ where: { id: account.id }})

            await stub.updateAccount(record, Account)
            
          }

          if (options.fields.includes('latitude')) {

            let record = await Account.findOne({ where: { id: account.id }})

            await setPositionFromLatLng(record)

          }


        } catch(error) {

          log.error('models.Account.afterUpadate.error', error)

        }

      },

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

