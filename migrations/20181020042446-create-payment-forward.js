'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('payment_forwards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      input_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      input_currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      output_address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      output_currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expired: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('payment_forwards');
  }
};
