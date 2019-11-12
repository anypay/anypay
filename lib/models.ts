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

models.AchBatch.hasMany(models.AccountAch, {
  foreignKey: 'ach_batch_id',
  as: 'batch'
});
models.AccountAch.belongsTo(models.AchBatch, {
  foreignKey: 'ach_batch_id',
  as: 'batch'
});
models.AccountAch.belongsTo(models.Account, {
  foreignKey: 'account_id'
});

models.AccountAchInvoice.belongsTo(models.AccountAch, {
  foreignKey: 'account_ach_id',
  as: 'invoices'
});
models.AccountAch.hasMany(models.AccountAchInvoice, {
  foreignKey: 'account_ach_id',
  as: 'invoices'
})
models.AccountAchInvoice.hasOne(models.Invoice, {
  foreignKey: 'uid',
  sourceKey: 'invoice_uid',
  as: 'invoice'
});

models.Shareholder.hasMany(models.ShareholderDocument, {
  foreignKey: 'shareholder_id',
  sourceKey: 'id',
  as: 'shareholder_documents'
});

models.Shareholder.hasOne(models.Account, {
  foreignKey: 'id',
  sourceKey: 'account_id',
  as: 'account'
});

export { models };

