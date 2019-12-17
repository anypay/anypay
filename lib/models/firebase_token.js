'use strict';
module.exports = (sequelize, DataTypes) => {
  var FirebaseToken = sequelize.define('FirebaseToken', {
    token: DataTypes.STRING,
    account_id: DataTypes.INTEGER
  }, {
    tableName: 'firebase_tokens',
    classMethods: {
      associate: function(models) {
        FirebaseToken.belongsTo(models.Account);
      }
    }
  });
  return FirebaseToken;
};
