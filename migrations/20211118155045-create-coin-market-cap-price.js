'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CoinMarketCapPrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      symbol: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
      },
      num_market_pairs: {
        type: Sequelize.INTEGER
      },
      date_added: {
        type: Sequelize.DATE
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      max_supply: {
        type: Sequelize.DECIMAL
      },
      circulating_supply: {
        type: Sequelize.DECIMAL
      },
      total_supply: {
        type: Sequelize.DECIMAL
      },
      cmc_rank: {
        type: Sequelize.INTEGER
      },
      last_updated: {
        type: Sequelize.DATE
      },
      quote: {
        type: Sequelize.JSON
      },
      cmc_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CoinMarketCapPrices');
  }
};
