'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.addColumn('extended_public_keys', 'currency', {

      type: Sequelize.STRING,

      allowNull: true

    });

  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.removeColumn('extended_public_keys', 'currency');

  }
};
