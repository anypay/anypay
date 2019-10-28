'use strict';
module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    name: DataTypes.STRING,
    county: DataTypes.STRING,
    population: DataTypes.INTEGER
  }, {

    tableName: 'cities'
  
  });
  City.associate = function(models) {
    // associations can be defined here
  };
  return City;
};
