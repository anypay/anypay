'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('access_tokens', {
      uid: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.addColumn('access_tokens', 'app_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('access_tokens', 'app_id');
  }
};
