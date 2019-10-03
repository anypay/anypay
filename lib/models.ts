import * as Sequelize from 'sequelize';
import * as sequelize from './database';

import { join } from 'path';
import { awaitChannel } from './amqp';
import { log } from './logger';
import { bindAllModelsHooks } from './rabbi-sequelize';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var models: any = require('require-all')({
  dirname: join(__dirname, 'models'),
  map: function(name, path) {
    return name.split('_').map(p => {

      return capitalizeFirstLetter(p);    

    })
    .join('');
  },
  resolve: (model) => model(sequelize, Sequelize)
});

const exchange = 'anypay.events';

bindAllModelsHooks(models, exchange);

models.CashbackCustomerPayment.belongsTo(models.Invoice, {
  foreignKey: 'invoice_id'
});

export { models };

