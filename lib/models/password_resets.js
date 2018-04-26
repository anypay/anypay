const Sequelize = require('sequelize');
const sequelize = require('../database');

const PasswordReset = sequelize.define('password_reset', {
  uid: {   
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  claimed: {
    type: Sequelize.BOOLEAN
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  }
}, {
  // options
});

module.exports = PasswordReset;

