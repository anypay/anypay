'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    return queryInterface.addColumn('events', 'invoice_uid', {

      type: Sequelize.STRING,

      allowNull: true

    })

  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('events', 'invoice_uid')

  }

};
