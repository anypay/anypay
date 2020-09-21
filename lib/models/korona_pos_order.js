'use strict';
module.exports = (sequelize, DataTypes) => {
  const KoronaPosOrder = sequelize.define('KoronaPosOrder', {
    payload: DataTypes.JSON
  }, {});
  KoronaPosOrder.associate = function(models) {
    // associations can be defined here
  };
  return KoronaPosOrder;
};