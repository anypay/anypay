'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface
    .changeColumn('bank_accounts', 'zip', {
      type: Sequelize.STRING(),
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface
    .changeColumn('bank_accounts', 'zip', {
      type: Sequelize.INTEGER(),
      allowNull: false
    });
  }
};
