'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addIndex('events', {
      fields: ['type'],
      name: 'events_by_type'
    })

    await queryInterface.addIndex('events', {
      fields: ['account_id'],
      name: 'events_by_account_id'
    })

    await queryInterface.addIndex('events', {
      fields: ['invoice_uid'],
      name: 'events_by_invoice_uid'
    })

    await queryInterface.addIndex('events', {
      fields: ['type', 'account_id'],
      name: 'events_by_account_id_and_type'
    })

    await queryInterface.addIndex('events', {
      fields: ['type', 'invoice_uid'],
      name: 'events_by_invoice_uid_and_type'
    })

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeIndex('events', 'events_by_type')

    await queryInterface.removeIndex('events', 'events_by_account_id')

    await queryInterface.removeIndex('events', 'events_by_invoice_uid')

    await queryInterface.removeIndex('events', 'events_by_account_id_and_type')

    await queryInterface.removeIndex('events', 'events_by_invoice_uid_and_type')

  }
};
