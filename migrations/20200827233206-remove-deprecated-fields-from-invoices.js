'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'currency', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.changeColumn('invoices', 'account_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
