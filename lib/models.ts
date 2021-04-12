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

models.VendingTransaction.hasMany(models.VendingTransactionOutput, {
  foreignKey: 'vending_transaction_id',
  as: 'outputs'
});

models.VendingTransactionOutput.belongsTo(models.VendingTransaction, {
  foreignKey: 'vending_transaction_id',
  as: 'vending_transaction'
});

models.AchBatch.hasMany(models.AccountAch, {
  foreignKey: 'ach_batch_id',
  as: 'batch'
});

models.Invoice.hasMany(models.PaymentOption, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'payment_options'
});
models.Invoice.belongsTo(models.AchBatch, {
  foreignKey: 'ach_batch_id',
  as: 'ach_batch'
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
models.Invoice.hasOne(models.BitpaySettlement, {
  foreignKey: 'invoice_uid',
  sourceKey: 'uid',
  as: 'bitpay_settlement'
})
models.AccountAchInvoice.hasOne(models.Invoice, {
  foreignKey: 'uid',
  sourceKey: 'invoice_uid',
  as: 'invoice'
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

models.PayrollAccount.hasOne(models.Account, {
  foreignKey: 'id',
  sourceKey: 'account_id',
  as: 'account'
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

models.Account.hasMany(models.VendingMachine, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'vending_machines'
});

models.VendingMachine.belongsTo(models.Account, {
  as: 'kiosk',
  foreignKey: 'account_id'
})

models.Account.hasMany(models.VendingTransaction, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'vending_transactions'
});

models.Account.hasMany(models.AmbassadorReward, {
  foreignKey: 'ambassador_account_id',
  sourceKey: 'id',
  as: 'ambassador_rewards'
});

models.VendingTransaction.belongsTo(models.Account, {
  as: 'vending_transactions',
  foreignKey: 'account_id'
})

models.Account.hasMany(models.VendingTransactionOutput, {
  foreignKey: 'account_id',
  sourceKey: 'id',
  as: 'vending_transaction_outputs'
});

models.VendingTransactionOutput.belongsTo(models.Account, {
  as: 'vending_transaction_outputs',
  foreignKey: 'account_id'
})

models.VendingMachine.hasMany(models.VendingTransaction, {
  foreignKey: 'vending_machine_id',
  sourceKey: 'id',
  as: 'transactions'
});
models.VendingTransaction.belongsTo(models.VendingMachine, {
  as: 'kiosk',
  foreignKey: 'vending_machine_id'
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

models.AchBatch.belongsTo(models.Account, {
  as: 'account',
  foreignKey: 'account_id',
  sourceKey: 'id'
})

models.Account.hasMany(models.AchBatch, {
  as: 'ach_batches',
  foreignKey: 'account_id',
  sourceKey: 'id'
})
models.AnypayxDebit.hasOne(models.AchBatch, {
  as: 'ach_batch',
  foreignKey: 'id',
  sourceKey: 'settlement_id'
})

export { models };

