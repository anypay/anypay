'use strict';

import { publishEvent } from '../lib/events';

module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define('Transaction', {
    hash: DataTypes.STRING
  }, {

    tableName: 'transactions',

    hooks: {

      afterCreate: async function(instance) {

        await publishEvent('transaction.created', instance.hash);

      }

    },

    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Transaction;
};
