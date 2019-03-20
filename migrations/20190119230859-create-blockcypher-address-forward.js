'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('blockcypher_address_forwards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false
      },
      input_address: {
        type: Sequelize.STRING
      },
      process_fees_address: {
        type: Sequelize.STRING
      },
      process_fees_satoshis: {
        type: Sequelize.INTEGER
      },
      process_fees_percent: {
        type: Sequelize.DECIMAL
      },
      callback_url: {
        type: Sequelize.STRING
      },
      enable_confirmations: {
        type: Sequelize.BOOLEAN
      },
      mining_fees_satoshis: {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('blockcypher_address_forwards');
  }
};
