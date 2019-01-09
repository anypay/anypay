'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blockcypher_payment_forwards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      payment_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false
      },
      input_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mining_fee_satoshis: {
        type: Sequelize.INTEGER
      },
      process_fees_satoshis: {
        type: Sequelize.INTEGER
      },
      process_fees_address: {
        type: Sequelize.STRING
      },
      callback_url: {
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
    return queryInterface.dropTable('blockcypher_payment_forwards');
  }
};
