'use strict';

import * as shortid from 'shortid';

import { build as buildStub } from '../stub'

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stub: DataTypes.STRING,
    square_variation_id: DataTypes.STRING,
    square_catalog_object_id: DataTypes.STRING,
    image_url: DataTypes.STRING,
    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    period: {
      type: DataTypes.STRING,
      defaultValue: 'monthly'
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("price"));
      }
    },
    uid: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    payment_request_url: DataTypes.STRING,
    square_catalog_object_id: DataTypes.STRING
  }, {

    tableName: 'products',

    hooks: {

      beforeCreate: function(instance) {

        instance.uid = shortid.generate(); 

        instance.stub = buildStub({ business_name: instance.name })

        return instance

      }
    }
  
  });
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};

