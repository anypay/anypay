'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('settlements', 'bitpay_settlements');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable('bitpay_settlements', 'settlements');
  }
};
