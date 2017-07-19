const Sequelize = require('sequelize');
const sequelize = require('../database');
const uuid = require('uuid');

const DashPayout = sequelize.define('dash_payouts', {
  account_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  payment_hash: Sequelize.STRING,
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.DECIMAL,
    allowNull: false
  },
	status: {
    type: Sequelize.ENUM('unpaid', 'paid'),
    defaultValue: 'unpaid'
  },
	completedAt: Sequelize.DATE
});

module.exports = DashPayout;

