'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addIndex('events', {
      fields: ['invoice_uid'],
      name: 'events_invoice_uid',
      unique: false
    });

    await queryInterface.addIndex('events', {
      fields: ['invoice_uid', 'createdAt'],
      name: 'events_invoice_uid_created_at',
      unique: false
    });

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.dropIndex('events_invoice_uid_created_at')

    await queryInterface.dropIndex('events_invoice_uid')

  }
};
