'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment_options', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: true
    });
    await queryInterface.changeColumn('payment_options', 'address', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment_options', 'amount', {
      type: Sequelize.DECIMAL,
      allowNull: false
    });
    await queryInterface.changeColumn('payment_options', 'address', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
