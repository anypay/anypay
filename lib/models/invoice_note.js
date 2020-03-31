'use strict';
module.exports = (sequelize, DataTypes) => {
  const InvoiceNote = sequelize.define('InvoiceNote', {
    invoice_uid: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    underscored: true,
    tableName: 'invoice_notes'
  });
  InvoiceNote.associate = function(models) {
    // associations can be defined here
  };
  return InvoiceNote;
};
