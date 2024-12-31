'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('invoices', 'currency', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.sequelize.query(`update invoices SET amount = dollar_amount`);
    await queryInterface.sequelize.query(`update invoices SET currency = 'USD'`);

    await queryInterface.sequelize.query(`update invoices SET amount = amount`);
    await queryInterface.sequelize.query(`update invoices SET currency = currency`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invoices', 'amount');
    await queryInterface.removeColumn('invoices', 'currency');
    await queryInterface.removeColumn('invoices', 'amount');
    await queryInterface.removeColumn('invoices', 'currency');
  }
};
