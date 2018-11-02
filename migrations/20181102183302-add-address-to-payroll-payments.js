'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('payroll_payments', 'address', {

      type: Sequelize.STRING,

      allowNull: true

    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.removeColumn('payroll_payments', 'address');

  }
};
