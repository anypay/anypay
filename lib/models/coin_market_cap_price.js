'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CoinMarketCapPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CoinMarketCapPrice.init({
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    slug: DataTypes.STRING,
    num_market_pairs: DataTypes.INTEGER,
    date_added: DataTypes.DATE,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    max_supply: DataTypes.DECIMAL,
    circulating_supply: DataTypes.DECIMAL,
    total_supply: DataTypes.DECIMAL,
    cmc_rank: DataTypes.INTEGER,
    last_updated: DataTypes.DATE,
    quote: DataTypes.JSON,
    cmc_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CoinMarketCapPrice',
  });
  return CoinMarketCapPrice;
};
