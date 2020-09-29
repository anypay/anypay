'use strict';
module.exports = (sequelize, DataTypes) => {
  const Login = sequelize.define('Login', {
    account_id: DataTypes.INTEGER,
    ip_address: DataTypes.STRING,
    geolocation: DataTypes.JSON,
    user_agent: DataTypes.STRING
  }, {});
  Login.associate = function(models) {
    // associations can be defined here
  };
  return Login;
};