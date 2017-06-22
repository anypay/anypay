const Sequelize = require('sequelize');
const sequelize = require('../database');
const Account = require('./account');
const uuid = require('uuid');

const AccessToken = sequelize.define('access_token', {
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
    beforeCreate: (accessToken, options) => {
      accessToken.uid = uuid.v4();
    }
  }
});

module.exports = AccessToken;

