'use strict';

module.exports = (sequelize, DataTypes) => {
  const GrabAndGoItem = sequelize.define('GrabAndGoItem', {
    name: DataTypes.STRING,
    stub: DataTypes.STRING,
    price: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("price"));
      }
    },
    uid: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    payment_request_url: DataTypes.STRING
  }, {

    tableName: 'grab_and_go_items'
  
  });
  GrabAndGoItem.associate = function(models) {
    // associations can be defined here
  };
  return GrabAndGoItem;
};
