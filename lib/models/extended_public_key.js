const Sequelize = require('sequelize');
const sequelize = require('../database');

const ExtendedPublicKey = sequelize.define('extended_public_key', {
  xpubkey: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nonce: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  account_id: Sequelize.INTEGER
});

module.exports = ExtendedPublicKey;

