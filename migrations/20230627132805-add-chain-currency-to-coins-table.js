'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('coins', 'currency', {
      type: Sequelize.STRING
    })
    await queryInterface.addColumn('coins', 'chain', {
      type: Sequelize.STRING
    })
    //TODO: Remove allow-null after populating new column
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('coins', 'chain')
    await queryInterface.removeColumn('coins', 'currency')
  }
};
