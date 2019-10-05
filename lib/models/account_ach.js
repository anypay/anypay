'use strict';
module.exports = (sequelize, DataTypes) => {
  var AccountAch = sequelize.define('AccountAch', {
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ach_batch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    first_invoice_uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_invoice_uid: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {

    tableName: 'account_achs',

    classMethods: {

      associate: function(models) {

        models.AccountAch.belongsTo(models.AchBatch, {
          foreignKey: 'ach_batch_id' 
        });

        models.AccountAch.belongsTo(models.Account, {
          foreignKey: 'account_id'
        });

      }
    }

  });

  return AccountAch;
};
