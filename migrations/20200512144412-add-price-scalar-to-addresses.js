'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('addresses', 'price_scalar', {
      type: Sequelize.DECIMAL,
      defaultValue: 1.0,
      allowNull: true
    });

    await queryInterface.addColumn('addresses', 'note', {
      type: Sequelize.STRING,
      defaultValue: null,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('addresses', 'price_scalar');
    await queryInterface.removeColumn('addresses', 'note');
  }
};
