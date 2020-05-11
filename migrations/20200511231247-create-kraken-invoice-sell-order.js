'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('KrakenInvoiceSellOrders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_uid: {
        type: Sequelize.STRING
      },
      invoice_amount_paid: {
        type: Sequelize.DECIMAL
      },
      invoice_currency: {
        type: Sequelize.STRING
      },
      order_id: {
        type: Sequelize.STRING
      },
      order_volume: {
        type: Sequelize.DECIMAL
      },
      order_price: {
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
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('KrakenInvoiceSellOrders');
  }
};