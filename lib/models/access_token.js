const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');

const AccessToken = sequelize.define('access_token', {
  uid: Sequelize.STRING,
  account_id: Sequelize.INTEGER
}, {
  hooks: {
    beforeCreate: (accessToken, options) => {
      accessToken.uid = uuid.v4();
    }
  }
});

module.exports = AccessToken;

