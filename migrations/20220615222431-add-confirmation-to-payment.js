'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('payments', 'confirmation_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('payments', 'confirmation_hash', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('payments', 'confirmation_height', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('payments', 'confirmation_height')

    await queryInterface.removeColumn('payments', 'confirmation_hash')

    await queryInterface.removeColumn('payments', 'confirmation_date')

  }
};
