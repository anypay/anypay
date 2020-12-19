'use strict';
module.exports = (sequelize, DataTypes) => {
  const KoronaPosOrder = sequelize.define('KoronaPosOrder', {
    payload: DataTypes.JSON,
    account_id: DataTypes.INTEGER
  }, {});
  KoronaPosOrder.associate = function(models) {
    // associations can be defined here
  };
  return KoronaPosOrder;
};
