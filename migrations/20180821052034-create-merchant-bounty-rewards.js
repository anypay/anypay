'use strict';

module.exports = {

  up: async function (queryInterface, Sequelize) {

    await queryInterface.createTable('merchant_bounty_rewards', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      payment_hash: {

        type: Sequelize.STRING,

        allowNull: true

      },

      payment_currency: {

        type: Sequelize.STRING,

        allowNull: false

      },

      denomination_currency: {

        type: Sequelize.STRING,

        allowNull: false

      },

      payment_amount: {

        type: Sequelize.DECIMAL,

        allowNull: false

      },

      denomination_amount: {

        type: Sequelize.DECIMAL,

        allowNull: false

      },

      merchant_id: {

        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
  
          model: "accounts",

          key: "id"

        }

      },

      ambassador_id: {

        type: Sequelize.INTEGER,

        allowNull: false,

        references: {
  
          model: "accounts",

          key: "id"

        }

      },

      createdAt: {
        type: Sequelize.DATE
      },

      updatedAt: {
        type: Sequelize.DATE
      }

    });

  },


  down: async function (queryInterface, Sequelize) {

    await queryInterface.dropTable('merchant_bounty_rewards');

  }

};

