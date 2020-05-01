'use strict';
module.exports = (sequelize, DataTypes) => {
  const OauthApp = sequelize.define('OauthApp', {
    client_identifier: DataTypes.STRING,
    app_identifier: DataTypes.STRING,
    redirect_url: DataTypes.STRING
  }, {});
  OauthApp.associate = function(models) {
    // associations can be defined here
  };
  return OauthApp;
};