
import * as Boom from 'boom';

import { log, models, payroll } from '../../../lib';

import * as moment from 'moment';

export async function index(req) {

  try {

    let payroll_batches = await models.PayrollBatch.findAll({

      includes: [{
        model: models.PayrollPayments, as: 'payroll_payments'
      }]

    });

    payroll_batches = await Promise.all(payroll_batches.map(async (batch) => {

      let payroll_payments = await models.PayrollPayment.findAll({ where: {

        payroll_batch_id: batch.id

      }});

      console.log("PAYMENTS", payroll_payments);

      return Object.assign(batch, {payroll_payments});
    
    }));


    return { payroll_batches }

  } catch(error) {

    console.log(error.message);

  }

}

export async function create(req) {

  try {

    return payroll.createBatch(req.payload.payroll_date)

  } catch(error) {

    console.log(error.message);

  }

}

export async function show(req) {

  try {

    let payroll_batch = await models.PayrollBatch.findOne({

      where: {
        id: req.params.id
      },

      includes: [{
        model: models.PayrollPayments, as: 'payroll_payments'
      }]

    });

    return { payroll_batch }

  } catch(error) {

    console.log(error.message);

  }

}

