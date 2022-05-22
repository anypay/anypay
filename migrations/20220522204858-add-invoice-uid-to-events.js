'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    return queryInterface.addColumn('Events', 'invoice_uid', {

      type: 'string',

      allowNull: true

    })

  },

  down: async (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('Events', 'invoice_uid')

  }

};
