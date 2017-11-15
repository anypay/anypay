"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("accounts", "bitcoin_cash_address", {
      type: Sequelize.STRING
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn("accounts", "bitcoin_cash_address");
  }
};
