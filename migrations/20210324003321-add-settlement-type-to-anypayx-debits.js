'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('AnypayxDebits', 'settlement_type', { type: Sequelize.STRING });
    await queryInterface.addColumn('AnypayxDebits', 'settlement_id', { type: Sequelize.INTEGER });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('AnypayxDebits', 'settlement_type');
    await queryInterface.removeColumn('AnypayxDebits', 'settlement_id');

  }
};
