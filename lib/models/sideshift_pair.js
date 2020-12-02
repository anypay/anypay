'use strict';
module.exports = (sequelize, DataTypes) => {
  const SideshiftPair = sequelize.define('SideshiftPair', {
    input: DataTypes.STRING,
    output: DataTypes.STRING,
    rate: DataTypes.DECIMAL,
    min: DataTypes.DECIMAL,
    max: DataTypes.DECIMAL
  }, {});
  SideshiftPair.associate = function(models) {
    // associations can be defined here
  };
  return SideshiftPair;
};
