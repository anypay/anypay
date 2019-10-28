'use strict';
module.exports = (sequelize, DataTypes) => {
  const YelpBusiness = sequelize.define('YelpBusiness', {
    city_id: DataTypes.INTEGER,
    json_string: DataTypes.TEXT,
    yelp_id: DataTypes.STRING,
    alias: DataTypes.STRING,
    name: DataTypes.STRING,
    image_url: DataTypes.STRING,
    url: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    phone: DataTypes.STRING
  }, {
    tableName: 'yelp_businesses'
  });
  YelpBusiness.associate = function(models) {
    // associations can be defined here
  };
  return YelpBusiness;
};
