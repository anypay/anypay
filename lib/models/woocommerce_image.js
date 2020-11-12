'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WoocommerceImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  WoocommerceImage.init({
    url: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'WoocommerceImage',
  });
  return WoocommerceImage;
};
