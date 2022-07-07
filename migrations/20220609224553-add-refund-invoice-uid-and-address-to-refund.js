'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Refunds', 'original_invoice_uid', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('Refunds', 'refund_invoice_uid', {
      type: Sequelize.STRING,
      allowNull: false
    });
 
    await queryInterface.addColumn('Refunds', 'address', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.addColumn('Refunds', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'unpaid',
      allowNull: false
    });

    await queryInterface.removeColumn('Refunds', 'invoice_uid')
    await queryInterface.removeColumn('Refunds', 'txid')
    await queryInterface.removeColumn('Refunds', 'rawtx')

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Refunds', 'original_invoice_uid')
    await queryInterface.removeColumn('Refunds', 'refund_invoice_uid')
    await queryInterface.removeColumn('Refunds', 'address')
    await queryInterface.removeColumn('Refunds', 'status')

  }
};
