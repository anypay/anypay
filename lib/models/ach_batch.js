'use strict';
module.exports = (sequelize, DataTypes) => {
  var AchBatch = sequelize.define('AchBatch', {
    batch_id: {
      type: DataTypes.INTEGER,
      defaultValue: null
    },
    payments_date: {
      type: DataTypes.DATE
    },
    effective_date: DataTypes.DATE,
    type: {
      type: DataTypes.STRING,
      defaultValue: 'ach'
    },
    batch_description: DataTypes.STRING,
    originating_account: {
      type: DataTypes.STRING,
      defaultValue: 'Mercury Bank'
    },
    amount: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue("amount"));
      }
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD'
    },
    status: DataTypes.STRING,
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
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
