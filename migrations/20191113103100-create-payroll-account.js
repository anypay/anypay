'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
    return queryInterface.createTable('PayrollAccounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      base_currency: {
        type: Sequelize.STRING
      },
      base_monthly_amount: {
        type: Sequelize.DECIMAL
      },
      base_daily_amount: {
        type: Sequelize.DECIMAL
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
    */
  },
  down: async (queryInterface, Sequelize) => {
    //return queryInterface.dropTable('PayrollAccounts');
  }
};
