'use strict';
module.exports = function(sequelize, DataTypes) {
  var coins = sequelize.define('coins', {
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logo_url: {
      type: DataTypes.STRING
    },
    precision: {
      type: DataTypes.INTEGER
    },
    uri_template: {
      type: DataTypes.STRING
    },
    unavailable: {
      type: DataTypes.BOOLEAN
    },
    supported: {
      type: DataTypes.BOOLEAN
    },
    required_fee_rate: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return coins;
};
