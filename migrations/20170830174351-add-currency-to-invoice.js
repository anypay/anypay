"use strict";

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn("invoices", "currency", {
      type: Sequelize.STRING
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn("invoices", "currency");
  }
};
