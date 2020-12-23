'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('settlements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      txid: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      currency: {
        type: Sequelize.STRING
      },
      error: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    //await queryInterface.renameColumn('invoices', 'convert_to_bank', 'should_settle');

    await queryInterface.addColumn('accounts', 'should_settle', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },
  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropTable('settlements');

    //await queryInterface.renameColumn('invoices', 'should_settle', 'convert_to_bank');

  }
};
