'use strict';
module.exports = (sequelize, DataTypes) => {
  var VendingMachine = sequelize.define('VendingMachine', {
    serial_number: DataTypes.STRING,
    current_location_name: DataTypes.STRING,
    current_location_address: DataTypes.STRING,
    machine_type: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    tableName: 'vending_machines',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return VendingMachine;
};
