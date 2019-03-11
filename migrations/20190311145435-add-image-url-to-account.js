'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('accounts', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('accounts', 'image_url');
  }
};
