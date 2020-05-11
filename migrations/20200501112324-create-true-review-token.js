'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('TrueReviewsTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_uid: {
        type: Sequelize.STRING
      },
      origin: {
        type: Sequelize.STRING
      },
      timestamp: {
        type: Sequelize.STRING
      },
      redeemURL: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      placeID: {
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
    return queryInterface.dropTable('TrueReviewsTokens');
  }
};
