import * as Sequelize from 'sequelize';

import * as sequelize from './database';

import { join } from 'path';

//import { bindAllModelsHooks } from './rabbi-sequelize';

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

//const exchange = 'anypay.events';

//bindAllModelsHooks(models, exchange);

models.Invoice.hasMany(models.PaymentOption, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'payment_options'
});

models.Invoice.hasOne(models.Payment, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'payment'
})

models.Invoice.hasOne(models.Refund, {
  foreignKey: 'original_invoice_uid',
  sourceKey: 'uid',
  as: 'refund'
})

models.Account.hasMany(models.Address, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'addresses'
});

models.Address.belongsTo(models.Account, {
  as: 'address',
  foreignKey: 'account_id'
})

models.LinkedAccount.belongsTo(models.Account, {
  as: 'source_account',
  foreignKey: 'source',
})

models.LinkedAccount.belongsTo(models.Account, {
  as: 'target_account',
  foreignKey: 'target'
})

models.Account.hasMany(models.Invoice, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'invoices'
});

models.Invoice.belongsTo(models.Account, {
  as: 'account',
  foreignKey: 'account_id'
})

models.Account.hasMany(models.AccountTag, {
  as: 'tags',
  foreignKey: 'account_id',
  sourceKey: 'id'
});

models.AccountTag.belongsTo(models.Account, {
  as: 'account',
  foreignKey: 'account_id'
});

models.Invoice.hasMany(models.InvoiceNote, {
  as: 'notes',
  foreignKey: 'invoice_uid',
  sourceKey: 'uid'
});

models.Webhook.hasMany(models.WebhookAttempt, {
  foreignKey: 'webhook_id',
  sourceKey: 'id',
  as: 'attempts'
});

models.Payment.hasOne(models.PaymentOption, {
  foreignKey: 'id',
  sourceKey: 'payment_option_id',
  as: 'option'
});

models.Payment.hasOne(models.Invoice, {
  foreignKey: 'uid',
  sourceKey: 'invoice_uid',
  as: 'invoice'
});

export { models };

