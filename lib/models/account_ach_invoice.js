'use strict';
module.exports = (sequelize, DataTypes) => {
  var AccountAchInvoice = sequelize.define('AccountAchInvoice', {
    account_ach_id: DataTypes.INTEGER,
    invoice_uid: DataTypes.STRING
  }, {
    tableName: 'account_ach_invoices',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AccountAchInvoice;
};
