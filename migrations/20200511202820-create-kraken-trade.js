'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('KrakenTrades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ordertxid: {
        type: Sequelize.STRING
      },
      postxid: {
        type: Sequelize.STRING
      },
      pair: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DECIMAL
      },
      type: {
        type: Sequelize.STRING
      },
      ordertype: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      cost: {
        type: Sequelize.DECIMAL
      },
      fee: {
        type: Sequelize.DECIMAL
      },
      vol: {
        type: Sequelize.DECIMAL
      },
      margin: {
        type: Sequelize.DECIMAL
      },
      misc: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('KrakenTrades');

  }
};
