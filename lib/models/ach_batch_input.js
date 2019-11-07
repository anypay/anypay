'use strict';
module.exports = (sequelize, DataTypes) => {
  const ach_batch_input = sequelize.define('ach_batch_input', {
    bank_account_id: DataTypes.INTEGER,
    ach_batch_output_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    invoice_uid: DataTypes.STRING,
    batch_id: DataTypes.INTEGER
  }, {});
  ach_batch_input.associate = function(models) {
    // associations can be defined here
  };
  return ach_batch_input;
};
