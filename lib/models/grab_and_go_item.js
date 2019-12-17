'use strict';
module.exports = (sequelize, DataTypes) => {
  const GrabAndGoItem = sequelize.define('GrabAndGoItem', {
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    uid: DataTypes.STRING,
    account_id: DataTypes.INTEGER,
    payment_request_url: DataTypes.STRING
  }, {});
  GrabAndGoItem.associate = function(models) {
    // associations can be defined here
  };
  return GrabAndGoItem;
};