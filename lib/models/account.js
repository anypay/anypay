const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');

const Account = sequelize.define('account', {
  uid: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: Sequelize.STRING
  },
  dash_payout_address: {
    type: Sequelize.STRING
  },
  bitcoin_payout_address: {
    type: Sequelize.STRING
  },
  bitcoin_cash_address: {
    type: Sequelize.STRING
  },
  bitcoin_cash_enabled: {
    type: Sequelize.BOOLEAN
  },
  litecoin_address: {
    type: Sequelize.STRING
  },
  litecoin_enabled: {
    type: Sequelize.BOOLEAN
  }
}, {
  hooks: {
    beforeCreate: (account, options) => {
      account.uid = uuid.v4();
      account.email = account.email.toLowerCase();
    }
  }
});

module.exports = Account;

