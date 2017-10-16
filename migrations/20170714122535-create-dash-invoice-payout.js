"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable("dash_invoice_payouts", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      dash_invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "invoices",
          key: "id"
        }
      },
      dash_payout_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "dash_payouts",
          key: "id"
        }
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable("dash_invoice_payouts");
  }
};
