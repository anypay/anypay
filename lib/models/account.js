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
  }
}, {
  hooks: {
    beforeCreate: (account, options) => {
      account.uid = uuid.v4();
    }
  }
});

module.exports = Account;

