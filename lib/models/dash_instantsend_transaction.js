'use strict';
module.exports = function(sequelize, DataTypes) {

  var dash_instantsend_transaction = sequelize.define('dash_instantsend_transactions', {

    hash: {
      
      type: DataTypes.STRING,

      allowNull: false

    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return dash_instantsend_transaction;
};
