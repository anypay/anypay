
import { log } from '../log'

import * as Joi from '@hapi/joi';

import * as moment from 'moment';

const DEFAULT_WEBHOOK_URL = 'https://api.anypayx.com/v1/api/test/webhooks'

const shortid = require("shortid");

module.exports = function(sequelize, Sequelize) {

  const Account = require("./account")(sequelize, Sequelize);

  const Invoice = sequelize.define(
    "invoice",
    {
      uid: Sequelize.STRING,
      currency: Sequelize.STRING,
      email: Sequelize.STRING,
      amount: {
        type: Sequelize.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("amount"));
        }
      },
      external_id: {
        type: Sequelize.STRING
      },
      business_id: {
        type: Sequelize.STRING
      },
      location_id: {
        type: Sequelize.STRING
      },
      register_id: {
        type: Sequelize.STRING
      },
      cancelled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      app_id: {
        type: Sequelize.INTEGER
      },
      secret: {
        type: Sequelize.STRING
      },
      item_uid: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.JSON
      },
      headers: {
        type: Sequelize.JSON
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      is_public_request: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      currency_specified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      replace_by_fee: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      expiry: {
        type: Sequelize.DATE
      },
      complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      completed_at: {
        type: Sequelize.DATE
      },
      redirect_url: {
        type: Sequelize.STRING
      },
      webhook_url: {
        type: Sequelize.STRING,
        defaultValue: DEFAULT_WEBHOOK_URL
      },
      invoice_amount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          let value = this.getDataValue("invoice_amount")
          if (value) { return parseFloat(value) }
        }
      },
      invoice_amount_paid: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          let value = this.getDataValue("invoice_amount_paid")
          if (value) { return parseFloat(value) }
        }
      },
      invoice_currency: {
        type: Sequelize.STRING,
        allowNull: true
      },
      denomination_amount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          let value = this.getDataValue("denomination_amount")
          if (value) { return parseFloat(value) }
        }
      },
      denomination_amount_paid: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          let value = this.getDataValue("denomination_amount_paid")
          if (value) { return parseFloat(value) }
        }
      },
      denomination_currency: {
        type: Sequelize.STRING,
        allowNull: true
      },

      denomination: {
        type: Sequelize.VIRTUAL,
        get() {
          return this.getDataValue("denomination_currency")
        }
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      energycity_account_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      access_token: Sequelize.STRING,
      wordpress_site_url: Sequelize.STRING,
      hash: Sequelize.STRING,
      status: {
        type: Sequelize.STRING,
        defaultValue: 'unpaid'
      },
      complete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      uri: {
        type: Sequelize.STRING
      },
      completed_at: {
        type: Sequelize.DATE
      },
      settledAt: Sequelize.DATE,
      paidAt: Sequelize.DATE
    },
    {
      hooks: {
        beforeCreate: (invoice, options) => {
          if (!invoice.uid) {
            invoice.uid = shortid.generate();
          }
          invoice.uri = `pay:?r=https://api.anypayinc.com/r/${invoice.uid}`

          invoice.expiry = moment().add(15, 'minutes').toDate();
        },
        afterCreate: (invoice, options) => {

          log.info('invoice.created', invoice);

        }
      }
    }
  );

  return Invoice;
}

module.exports.Request = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  redirect_url: Joi.string(),
  webhook_url: Joi.string(),
  wordpress_site_url: Joi.string(),
  external_id: Joi.string()
}).label('InvoiceRequest');

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  currency: Joi.string().required(), // deprecated -> invoice currency
  amount: Joi.number().required(), // deprecated -> invoice amount
  invoice_currency: Joi.string().required(),
  invoice_amount: Joi.number().required(),
  invoice_amount_paid: Joi.number(),
  denomination_currency: Joi.string().required(),
  denomination_amount: Joi.number().required(),
  denomination_amount_paid: Joi.number(),
  dollar_amount: Joi.number().required(), // deprecated -> denomination amount
  address: Joi.string().required(), 
  account_id: Joi.number().integer().required(),  
  access_token: Joi.string(),
  hash: Joi.string(),
  status: Joi.string().required(),
  complete: Joi.string().required(),
  completed_at: Joi.date(),
  settledAt: Joi.date(),
  paidAt: Joi.date(),
  redirect_url: Joi.string(),
  external_id: Joi.string(),
  locked: Joi.boolean(),
  is_public_request: Joi.boolean(),
  replace_by_fee: Joi.boolean(),
  uri: Joi.string(),
  payment_options: Joi.array()
}).label('Invoice');

