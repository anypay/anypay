'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('accounts', 'registration_geolocation', { type: Sequelize.JSON });
    await queryInterface.addColumn('accounts', 'registration_ip_address', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('accounts', 'registration_geolocation');
    await queryInterface.removeColumn('accounts', 'registration_ip_address');
  }
};
