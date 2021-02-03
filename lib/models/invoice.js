const shortid = require("shortid");
const log = require("winston");
const Joi = require('joi');

const events = require('../events');

import * as moment from 'moment';

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
      app_id: {
        type: Sequelize.INTEGER
      },
      secret: {
        type: Sequelize.STRING
      },
      metadata: {
        type: Sequelize.JSON
      },
      /*should_settle: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },*/
      settlement_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ach_batch_id: {
        type: Sequelize.INTEGER,
        allowNull: true
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
      cashback_amount: {
        type: Sequelize.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("cashback_amount"));
        }
      },
      cashback_denomination_amount: {
        type: Sequelize.DECIMAL,
        get() {
          return parseFloat(this.getDataValue("cashback_denomination_amount"));
        }
      },
      settlement_amount: {
        type: Sequelize.VIRTUAL,
        get () {
          let cashbackAmount = this.getDataValue('cashback_denomination_amount') || 0; 

          return this.getDataValue('denomination_amount_paid') - cashbackAmount;
        }
      },
      expiry: {
        type: Sequelize.DATE
      },
      output_hash: {
        type: Sequelize.STRING
      },
      output_currency: {
        type: Sequelize.STRING
      },
      output_address: {
        type: Sequelize.STRING
      },
      output_amount: {
        type: Sequelize.DECIMAL
      },
      dollar_amount: {
        type: Sequelize.DECIMAL
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
        type: Sequelize.STRING
      },
      invoice_amount: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          return parseFloat(this.getDataValue("invoice_amount"));
        }
      },
      invoice_amount_paid: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          return parseFloat(this.getDataValue("invoice_amount_paid"));
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
          return parseFloat(this.getDataValue("denomination_amount"));
        }
      },
      denomination_amount_paid: {
        type: Sequelize.DECIMAL,
        allowNull: true,
        get() {
          return parseFloat(this.getDataValue("denomination_amount_paid"));
        }
      },
      denomination_currency: {
        type: Sequelize.STRING,
        allowNull: true
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

          events.emitter.emit('invoice.created', invoice);

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
  cashback_amount: Joi.string(),
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
  cashback_amount: Joi.number(),
  cashback_denomination_amount: Joi.number(),
  locked: Joi.boolean(),
  is_public_request: Joi.boolean(),
  replace_by_fee: Joi.boolean(),
  uri: Joi.string(),
  payment_options: Joi.array()
}).label('Invoice');

