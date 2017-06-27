const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');

const DashPayout = sequelize.define('dash_payouts', {
  account_id: Sequelize.INTEGER,
  payment_hash: Sequelize.STRING,
  amount: Sequelize.DECIMAL,
	status: {
    type: Sequelize.ENUM('unpaid', 'paid'),
    defaultValue: 'unpaid'
  },
	completedAt: Sequelize.DATE
});

module.exports = DashPayout;

