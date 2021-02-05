'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('bitpay_settlements', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: false 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('bitpay_settlements', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: true 
    });
  }
};
