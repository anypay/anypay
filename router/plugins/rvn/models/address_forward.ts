'use strict';

import * as uuid from 'uuid';

import { publishEvent } from '../lib/events';

module.exports = function(sequelize, DataTypes) {
  var AddressForward = sequelize.define('AddressForward', {
    uid: {
      type: DataTypes.STRING,
      allowNull: true
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    input_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: true
    },
    process_fee_satoshis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    process_fees_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    process_fees_percent: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    callback_url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enable_confirmations: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    mining_fee_satohis: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    txns: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    }
  }, {

    tableName: 'address_forwards',

    hooks: {

      beforeCreate: async (instance, options) => {

        instance.uid = uuid.v4();

        return instance;
      },

      afterCreate: async function(instance) {

        await publishEvent('addressforward.created', instance.toJSON());

      }

    },

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return AddressForward;
};
