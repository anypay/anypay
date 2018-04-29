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
    address: Sequelize.STRING,
    account_id: Sequelize.INTEGER,
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

module.exports.Response = Joi.object({
    uid: Joi.string(),
    currency: Joi.string(),
    amount: Joi.number(),
    dollar_amount: Joi.number()
    address: Joi.string(),
    account_id: Joi.number().integer(),
    access_token: Joi.string(),
    hash: Joi.string(),
    status: Joi.string(),
    settledAt: Joi.date()
    paidAt: Joi.date()
}).label('Invoice');
