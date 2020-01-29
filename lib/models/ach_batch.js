'use strict';
module.exports = (sequelize, DataTypes) => {
  var AchBatch = sequelize.define('AchBatch', {
    batch_id: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    effective_date: DataTypes.DATE,
    type: DataTypes.STRING,
    batch_description: DataTypes.STRING,
    originating_account: DataTypes.STRING,
    amount: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("amount"));
      }
    },
    currency: DataTypes.STRING,
    last_invoice_uid: {
      type: DataTypes.STRING
    },
    first_invoice_uid: {
      type: DataTypes.STRING
    }
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
