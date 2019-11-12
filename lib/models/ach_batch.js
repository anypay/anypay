'use strict';
module.exports = (sequelize, DataTypes) => {
  var AchBatch = sequelize.define('AchBatch', {
    bank_batch_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    effective_date: DataTypes.DATE,
    type: DataTypes.STRING,
    batch_description: DataTypes.STRING,
    originating_account: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING
  }, {
    tableName: 'ach_batches',
    classMethods: {
      associate: function(models) {

        models.AchBatch.hasMany(models.AccountAch);

        // associations can be defined here
      }
    }
  });
  return AchBatch;
};
