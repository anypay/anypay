'use strict';
const Sequelize = require('sequelize');
const sequelize = require('../database');

var Address = sequelize.define('address', {
  account_id: Sequelize.INTEGER,
  currency: Sequelize.STRING,
  plugin: Sequelize.STRING,
  value: Sequelize.STRING,
  locked: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  nonce: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  classMethods: {
    associate: function(models) {
      // associations can be defined here
    }
  }
});


module.exports = Address;
