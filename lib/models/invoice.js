const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');
const SlackNotifier = require("../slack/notifier");
const log = require("winston");

const Invoice = sequelize.define('invoice', {
  uid: Sequelize.STRING,
  amount: Sequelize.DECIMAL,
  address: Sequelize.STRING,
  account_id: Sequelize.INTEGER,
  access_token: Sequelize.STRING,
	hash: Sequelize.STRING,
	status: Sequelize.STRING,
  settledAt: Sequelize.DATE,
  paidAt: Sequelize.DATE,
}, {
  hooks: {
    beforeCreate: (invoice, options) => {
      invoice.uid = uuid.v4();
    },
    afterCreate: (invoice, options) => {
      const invoiceJson = invoice.toJSON();

      log.info("invoice:created", invoiceJson);
      if (process.env.NODE_ENV === 'production') {
        SlackNotifier.notify(`invoice:created ${invoiceJson}`);
      }
    }
  }
});

module.exports = Invoice;

