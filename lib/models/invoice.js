const Sequelize = require("sequelize");
const sequelize = require("../database");
const uuid = require("uuid");
const SlackNotifier = require("../slack/notifier");
const log = require("winston");
const Account = require("./account");
const Joi = require('joi');

const Invoice = sequelize.define(
  "invoice",
  {
    uid: { type: Sequelize.STRING, allowNull: false },
    currency: { type: Sequelize.STRING, allowNull: false },
    amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue("amount"));
      }
    },
    dollar_amount: { type: Sequelize.DECIMAL, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    account_id: { type: Sequelize.INTEGER, allowNull: false },
    access_token: Sequelize.STRING,
    hash: Sequelize.STRING,
    status: { type: Sequelize.STRING, allowNull: true, defaultValue: 'unpaid' },
    settledAt: Sequelize.DATE,
    paidAt: Sequelize.DATE
  },
  {
    hooks: {
      beforeCreate: (invoice, options) => {
        invoice.uid = uuid.v4();
      },
      afterCreate: (invoice, options) => {
        Account.findOne({ where: { id: invoice.account_id } })
          .then(account => {
            const message = `|${account.email}|$${invoice.dollar_amount}|${invoice.currency} ${invoice.amount}|https://pos.anypay.global/invoices/${invoice.uid}`;

            log.info("invoice:created", message);
            if (process.env.NODE_ENV === "production") {
              SlackNotifier.notify(`invoice:created ${message}`);
            }
          })
          .catch(error => {
            log.error(error.message);
          });
      }
    }
  }
);
module.exports = Invoice;

module.exports.Request = Joi.object({
  amount: Joi.number().required(),
}).label('InvoiceRequest');

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  currency: Joi.string().required(),
  amount: Joi.number().required(),
  dollar_amount: Joi.number().required(),
  address: Joi.string().required(),
  account_id: Joi.number().integer().required(),  
  access_token: Joi.string(),
  hash: Joi.string(),
  status: Joi.string().required(),
  settledAt: Joi.date(),
  paidAt: Joi.date(),
}).label('Invoice');
