const Sequelize = require('sequelize');
const sequelize = require('../database');
const Account = require('./account');
const AccessToken = require('./access_token');
const crypto = require('crypto');
const Joi = require('joi');

const PairToken = sequelize.define('pair_token', {
  uid: Sequelize.STRING,
  device_name: {
    type: Sequelize.STRING,
    unique: true
  },
  access_token_id: {
    type: Sequelize.INTEGER,
    references: {
      model: AccessToken,
      key: 'id'
    }
  },
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

module.exports.Response = Joi.object({
  uid: Joi.string().required(),
  device_name: Joi.string().required(),
  access_token_id: Joi.string().required(),
  account_id: Joi.string().required(),
}).label('PairToken');

