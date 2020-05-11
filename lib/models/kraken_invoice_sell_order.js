'use strict';
module.exports = (sequelize, DataTypes) => {
  const KrakenInvoiceSellOrder = sequelize.define('KrakenInvoiceSellOrder', {
    invoice_uid: DataTypes.STRING,
    invoice_amount_paid: DataTypes.DECIMAL,
    invoice_currency: DataTypes.STRING,
    order_id: DataTypes.STRING,
    order_volume: DataTypes.DECIMAL,
    order_price: DataTypes.DECIMAL
  }, {});
  KrakenInvoiceSellOrder.associate = function(models) {
    // associations can be defined here
  };
  return KrakenInvoiceSellOrder;
};