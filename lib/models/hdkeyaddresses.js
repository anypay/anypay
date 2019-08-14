'use strict';

module.exports = (sequelize, DataTypes) => {
  const HDKeyAddresses = sequelize.define('HDKeyAddresses', {
    currency: DataTypes.STRING,
    address: DataTypes.STRING,
    xpub_key: DataTypes.STRING
  })
  return HDKeyAddresses;
};
