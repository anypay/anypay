'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable('dash_payouts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        }
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      payment_hash: {
        type: Sequelize.STRING
      },
      completedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dash_payouts');
  }
};
