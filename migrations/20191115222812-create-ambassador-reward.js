'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ambassador_rewards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      error: {
        type: Sequelize.STRING
      },
      txid: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      ambassador_id: {
        type: Sequelize.INTEGER
      },
      invoice_uid: {
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ambassador_rewards');
  }
};
