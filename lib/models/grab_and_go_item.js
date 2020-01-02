'use strict';

import * as shortid from 'shortid';

module.exports = (sequelize, DataTypes) => {
  const GrabAndGoItem = sequelize.define('GrabAndGoItem', {
    name: DataTypes.STRING,
    stub: DataTypes.STRING,
    square_variation_id: DataTypes.STRING,
    square_catalog_object_id: DataTypes.STRING,
    price: {
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

    tableName: 'grab_and_go_items',

    classMethods: {
      beforeCreate: function(instance) {

        instance.uid = shortid.generate(); 

      }
    }
  
  });
  GrabAndGoItem.associate = function(models) {
    // associations can be defined here
  };
  return GrabAndGoItem;
};
