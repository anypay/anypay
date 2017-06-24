const Sequelize = require('sequelize');
const sequelize = require('../database');
const Account = require('./account');
const crypto = require('crypto');

const PairToken = sequelize.define('pair_token', {
  uid: Sequelize.STRING,
  account_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Account,
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeCreate: (pairToken, options) => {
      pairToken.uid = crypto.randomBytes(3).toString('hex').toUpperCase();
    }
  }
});

module.exports = PairToken;

