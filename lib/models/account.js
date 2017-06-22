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
  password: {
    type: Sequelize.STRING
  }
}, {
  hooks: {
    beforeCreate: (account, options) => {
      account.uid = uuid.v4();
    }
  },
  instanceMethods: {
    generateHash: function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validPassword: function(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
});

module.exports = Account;

