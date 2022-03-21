import * as Sequelize from 'sequelize';

import * as sequelize from './database';

import { join } from 'path';

import { awaitChannel } from './amqp';

import { log } from './log';

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

models.Invoice.hasMany(models.PaymentOption, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'payment_options'
});

models.Invoice.hasOne(models.TrueReviewsToken, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'true_reviews_token'
});

models.TrueReviewsToken.belongsTo(models.Invoice, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'invoice'
});

models.Ambassador.hasOne(models.Account, {
  foreignKey: 'id',
  sourceKey: 'account_id',
  as: 'account'
});

models.Ambassador.hasMany(models.Account, {
  foreignKey: 'ambassador_id',
  sourceKey: 'id',
  as: 'merchants'
});

models.Ambassador.hasMany(models.AmbassadorReward, {
  foreignKey: 'ambassador_id',
  as: 'rewards'
});

models.AmbassadorReward.belongsTo(models.Ambassador, {
  foreignKey: 'ambassador_id',
  as: 'ambassador'
});

models.Account.hasOne(models.Ambassador, {
  foreignKey: 'id',
  sourceKey: 'ambassador_id',
  as: 'ambassador'
});

models.Account.hasMany(models.Address, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'addresses'
});

models.Address.belongsTo(models.Account, {
  as: 'address',
  foreignKey: 'account_id'
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

models.Account.hasMany(models.AmbassadorReward, {
  foreignKey: 'ambassador_account_id',
  sourceKey: 'id',
  as: 'ambassador_rewards'
});

models.Account.hasMany(models.AccountTag, {
  as: 'tags',
  foreignKey: 'account_id',
  sourceKey: 'id'
});

models.AccountTag.belongsTo(models.Account, {
  as: 'account',
  foreignKey: 'account_id'
});

models.Account.hasMany(models.Tipjar, {
  as: 'tipjars',
  foreignKey: 'account_id',
  sourceKey: 'id'
});

models.Tipjar.belongsTo(models.Account, {
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

