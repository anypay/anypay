'use strict';
module.exports = (sequelize, DataTypes) => {
  const TrueReviewsToken = sequelize.define('TrueReviewsToken', {
    invoice_uid: DataTypes.STRING,
    origin: DataTypes.STRING,
    timestamp: DataTypes.STRING,
    redeemURL: DataTypes.STRING,
    code: DataTypes.STRING,
    placeID: DataTypes.STRING
  }, {});
  TrueReviewsToken.associate = function(models) {
    // associations can be defined here
  };
  return TrueReviewsToken;
};
