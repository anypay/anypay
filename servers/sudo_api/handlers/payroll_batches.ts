
import * as Boom from 'boom';

import { log, models } from '../../../lib';

export async function index(req) {

  let payroll_batches = await models.PayrollBatch.findAll({

    includes: [{
      model: models.PayrollPayments, as: 'payroll_payments'
    }]

  });

  return { payroll_batches }

}

