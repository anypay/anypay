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
    uid: Sequelize.STRING,
    currency: Sequelize.STRING,
    amount: {
      type: Sequelize.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("amount"));
      }
    },
    dollar_amount: Sequelize.DECIMAL,
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    access_token: Sequelize.STRING,
    hash: Sequelize.STRING,
    status: {
			type: Sequelize.STRING,
			defaultValue: 'unpaid'
		},
    settledAt: Sequelize.DATE,
    paidAt: Sequelize.DATE
  },
  {
    hooks: {
      beforeCreate: (invoice, options) => {
        if (!invoice.uid) {
          invoice.uid = uuid.v4();
        }
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
  currency: Joi.string().required(),
}).label('InvoiceRequest');

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  currency: Joi.string().required(),
  amount: Joi.number().required(),
  dollar_amount: Joi.string().required(),
  address: Joi.string().required(),
  account_id: Joi.number().integer().required(),  
  access_token: Joi.string(),
  hash: Joi.string(),
  status: Joi.string().required(),
  settledAt: Joi.date(),
  paidAt: Joi.date(),
}).label('Invoice');
