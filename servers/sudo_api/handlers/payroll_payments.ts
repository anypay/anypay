
import * as Boom from 'boom';

import { log, models } from '../../../lib';

import * as moment from 'moment';

export async function create(req) {

  try {

    let payroll_batch = await models.PayrollBatch.findOne({

      where: {

        id: req.params.payroll_batch_id

      }

    });

    let payroll_account = await models.PayrollAccount.findOne({

      where: {

        id: req.params.payroll_account_id

      }

    });

    let [payroll_payment, isNew] = await models.PayrollPayment.findOrCreate({

      where: {

        payroll_account_id: payroll_account.id,
        payroll_batch_id: payroll_batch.id

      },

      defaults: {
        amount: req.payload.amount,
        currency: req.payload.currency,
        address: req.payload.currency,
        payroll_account_id: payroll_account.id,
        payroll_batch_id: payroll_batch.id
      }

    });

    return { payroll_payment, payroll_batch, payroll_account, isNew }

  } catch(error) {

    console.log(error.message);

  }

}

export async function show(req) {

  try {

    let payroll_payment = await models.PayrollPayment.findOne({

      where: {
        id: req.params.id
      },

      includes: [{
        model: models.PayrollBatch, as: 'payroll_batch'
      }, {
        model: models.PayrollAccount, as: 'payroll_account'
      }]

    });

    return { payroll_payment }

  } catch(error) {

    console.log(error.message);

  }

}

