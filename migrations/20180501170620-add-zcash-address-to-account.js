'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => (
    queryInterface.addColumn('accounts', 'zcash_t_address', {
      type: Sequelize.STRING
    })
  ),

  down: (queryInterface, Sequelize) => (
    queryInterface.removeColumn('accounts', 'zcash_t_address')
  )
};
