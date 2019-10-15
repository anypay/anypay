'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('account_achs', 'total_paid', {
      type: Sequelize.DECIMAL,
      allowNull: true,
      defaultValue: 0
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('account_achs', 'total_paid');
  }
};
