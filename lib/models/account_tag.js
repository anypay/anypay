'use strict';
module.exports = (sequelize, DataTypes) => {
  var AccountTag = sequelize.define('AccountTag', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: DataTypes.STRING
  }, {
    tableName: 'account_tags',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AccountTag;
};
