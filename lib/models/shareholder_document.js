'use strict';
module.exports = (sequelize, DataTypes) => {
  var ShareholderDocument = sequelize.define('ShareholderDocument', {
    shareholder_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'shareholder_documents',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ShareholderDocument;
};
