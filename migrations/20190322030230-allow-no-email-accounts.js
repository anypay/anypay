'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query('alter table accounts alter column email drop not null;')

  },

  down: async (queryInterface, Sequelize) => {

    /*await queryInterface.changeColumn('accounts', 'email', {
      type: Sequelize.STRING,
      allowNull: false
    });*/
  }
};
