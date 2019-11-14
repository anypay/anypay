'use strict';
module.exports = (sequelize, DataTypes) => {
  var PayrollBatch = sequelize.define('PayrollBatch', {
    payroll_date: DataTypes.DATE
  }, {
    tableName: 'payroll_batches',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PayrollBatch;
};
