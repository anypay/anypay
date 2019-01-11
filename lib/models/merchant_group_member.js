'use strict';
module.exports = (sequelize, DataTypes) => {
  var MerchantGroupMember = sequelize.define('merchant_group_member', {
    account_id: DataTypes.INTEGER,
    merchant_group_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MerchantGroupMember;
};
