'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tipjars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      private_key: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      currency: {
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

    await queryInterface.addColumn('accounts', 'tipjar_enabled', {

      type: Sequelize.BOOLEAN,

      defaultValue: false

    })

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tipjars');
    await queryInterface.removeColumn('accounts', 'tipjar_enabled');
  }
};
