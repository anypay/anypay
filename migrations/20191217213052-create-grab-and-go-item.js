'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('grab_and_go_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      stub: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      uid: {
        type: Sequelize.STRING
      },
      account_id: {
        type: Sequelize.INTEGER
      },
      payment_request_url: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }, {

      uniqueKeys: {
        grab_and_go_items_unique_stub: {
          fields: ['account_id', 'stub']
        },
        grab_and_go_items_unique_name: {
          fields: ['account_id', 'name']
        }
      }

    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('grab_and_go_items');
  }
};
