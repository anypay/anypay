"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "accounts",
          key: "id"
        }
      },
      access_token: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      settledAt: {
        type: Sequelize.DATE
      },
      paidAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("invoices");
  }
};
