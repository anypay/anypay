'use strict';
module.exports = (sequelize, DataTypes) => {
  const GrabAndGoInvoice = sequelize.define('GrabAndGoInvoice', {
    item_id: DataTypes.INTEGER,
    invoice_uid: DataTypes.STRING,
    square_order_id: DataTypes.STRING
  }, {
    tableName: 'grab_and_go_invoices' 
  });
  GrabAndGoInvoice.associate = function(models) {
    // associations can be defined here
  };
  return GrabAndGoInvoice;
};
