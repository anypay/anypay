'use strict';

module.exports = function(sequelize, Sequelize) {
  const ProtobufPayment = sequelize.define('ProtobufPayment', {
    hex: Sequelize.TEXT
  });

  return ProtobufPayment;
}


