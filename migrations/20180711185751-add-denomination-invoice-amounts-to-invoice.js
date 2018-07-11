'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'denomination_amount', {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('invoices', 'denomination_currency', {
      type: Sequelize.STRING,
      defaultValue: 'USD',
      allowNull: false
    });

    await queryInterface.addColumn('invoices', 'invoice_amount', {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('invoices', 'invoice_currency', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.sequelize.query(`update invoices SET denomination_amount = dollar_amount`);
    await queryInterface.sequelize.query(`update invoices SET denomination_currency = 'USD'`);

    await queryInterface.sequelize.query(`update invoices SET invoice_amount = amount`);
    await queryInterface.sequelize.query(`update invoices SET invoice_currency = currency`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invoices', 'denomination_amount');
    await queryInterface.removeColumn('invoices', 'denomination_currency');
    await queryInterface.removeColumn('invoices', 'invoice_amount');
    await queryInterface.removeColumn('invoices', 'invoice_currency');
  }
};
