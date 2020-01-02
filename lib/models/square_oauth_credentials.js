'use strict';
module.exports = (sequelize, DataTypes) => {
  const SquareOauthCredentials = sequelize.define('SquareOauthCredentials', {
    account_id: DataTypes.INTEGER,
    code: DataTypes.STRING,
    access_token: DataTypes.STRING,
    refresh_token: DataTypes.STRING
  }, {

    tableName: 'square_oauth_credentials'
  
  });
  SquareOauthCredentials.associate = function(models) {
    // associations can be defined here
  };
  return SquareOauthCredentials;
};
