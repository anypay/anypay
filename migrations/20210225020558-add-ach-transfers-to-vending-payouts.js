'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('VendingPayouts', 'currency', {
      type: Sequelize.DECIMAL
    });
    await queryInterface.addColumn('VendingPayouts', 'account_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('VendingPayouts', 'bank_account_id', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('VendingPayouts', 'payment_type', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('VendingPayouts', 'check_number', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('VendingPayouts', 'month_of_activity', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('VendingPayouts', 'bank_paid_from', {
      type: Sequelize.STRING
    });
    await queryInterface.addColumn('VendingPayouts', 'payment_date', {
      type: Sequelize.DATE
    });
    await queryInterface.addColumn('VendingPayouts', 'note', {
      type: Sequelize.TEXT
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('VendingPayouts', 'currency');
    await queryInterface.removeColumn('VendingPayouts', 'account_id');
    await queryInterface.removeColumn('VendingPayouts', 'bank_account_id');
    await queryInterface.removeColumn('VendingPayouts', 'payment_type');
    await queryInterface.removeColumn('VendingPayouts', 'check_number');
    await queryInterface.removeColumn('VendingPayouts', 'month_of_activity');
    await queryInterface.removeColumn('VendingPayouts', 'bank_paid_from');
    await queryInterface.removeColumn('VendingPayouts', 'payment_date');
    await queryInterface.removeColumn('VendingPayouts', 'note');
  }
};
