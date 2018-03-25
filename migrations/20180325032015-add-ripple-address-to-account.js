'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn('accounts', 'ripple_address', {
				type: Sequelize.STRING
			});
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('accounts', 'ripple_address');
  }
};
