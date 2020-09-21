'use strict';
module.exports = (sequelize, DataTypes) => {
  const TonicPowCampaign = sequelize.define('TonicPowCampaign', {
    account_id: DataTypes.INTEGER,
    campaign_id: DataTypes.INTEGER,
    data: DataTypes.JSON
  }, {});
  TonicPowCampaign.associate = function(models) {
    // associations can be defined here
  };
  return TonicPowCampaign;
};