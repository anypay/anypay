'use strict';

import { publishEvent } from '../lib/events';

module.exports = function(sequelize, DataTypes) {
  var AddressForwardCallback = sequelize.define('AddressForwardCallback', {
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue("value"));
      }
    },
    destination_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_transaction_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination_transaction_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {

    tableName: 'address_forward_callbacks',

    hooks: {

      afterCreate: async function(instance) {

        await publishEvent('addressforwardcallback.created', instance.toJSON());

      }

    },

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AddressForwardCallback;
};
