'use strict';
module.exports = (sequelize, DataTypes) => {
  var AchBatch = sequelize.define('AchBatch', {
    batch_id: DataTypes.INTEGER,
    effective_date: DataTypes.DATE,
    type: DataTypes.STRING,
    batch_description: DataTypes.STRING,
    originating_account: DataTypes.STRING,
    amount: DataTypes.NUMBER,
    currency: DataTypes.STRING
  }, {
    tableName: 'ach_batches',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AchBatch;
};
