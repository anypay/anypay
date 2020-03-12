'use strict';
module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    name: DataTypes.STRING
  }, {});
  Email.associate = function(models) {
    // associations can be defined here
  };
  return Email;
};