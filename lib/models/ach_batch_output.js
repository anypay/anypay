'use strict';
module.exports = (sequelize, DataTypes) => {
  const ach_batch_output = sequelize.define('ach_batch_output', {
    bank_account_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    currency: DataTypes.STRING,
    batch_id: DataTypes.INTEGER
  }, {});
  ach_batch_output.associate = function(models) {
    // associations can be defined here
  };
  return ach_batch_output;
};
