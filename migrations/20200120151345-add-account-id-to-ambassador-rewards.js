'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('ambassador_rewards', 'account_id', {

      type: Sequelize.INTEGER

    });

    await queryInterface.addColumn('ambassador_rewards', 'ambassador_account_id', {

      type: Sequelize.INTEGER

    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn("ambassador_rewards", "account_id");
    await queryInterface.removeColumn("ambassador_rewards", "ambassador_account_id");

  }
};
