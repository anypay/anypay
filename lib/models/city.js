'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: DataTypes.STRING,
    county: DataTypes.STRING,
    population: DataTypes.INTEGER,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    tag: DataTypes.STRING,
    stub: DataTypes.STRING,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL
  }, {

    tableName: 'cities'
  
  });
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};
