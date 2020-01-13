'use strict';
module.exports = (sequelize, DataTypes) => {
  const vending_output_strategy = sequelize.define('vending_output_strategy', {
    name: DataTypes.STRING,
    strategy: DataTypes.JSON
  }, {});
  vending_output_strategy.associate = function(models) {
    // associations can be defined here
  };
  return vending_output_strategy;
};