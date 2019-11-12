'use strict';
module.exports = (sequelize, DataTypes) => {
  var Shareholder = sequelize.define('Shareholder', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rvn_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shares: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    options: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'shareholders',
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Shareholder;
};
