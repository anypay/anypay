'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('KrakenDeposits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      kraken_account_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      aclass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      asset: {
        type: Sequelize.STRING,
        allowNull: false
      },
      refid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      txid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      info: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fee: {
        type: Sequelize.STRING,
        allowNull: false
      },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('KrakenDeposits');
  }
};
