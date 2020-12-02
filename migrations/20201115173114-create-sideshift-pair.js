'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SideshiftPairs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      input: {
        type: Sequelize.STRING
      },
      output: {
        type: Sequelize.STRING
      },
      rate: {
        type: Sequelize.DECIMAL
      },
      min: {
        type: Sequelize.DECIMAL
      },
      max: {
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
    return queryInterface.dropTable('SideshiftPairs');
  }
};
