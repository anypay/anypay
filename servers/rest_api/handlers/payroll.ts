
import * as Boom from 'boom';

import { models } from '../../../lib';
import { Op } from 'sequelize';

export async function show(req) {

  try {

    let payroll_account = await models.PayrollAccount.findOne({ where: {

      account_id: req.account.id

    }});

    if (!payroll_account) {
      throw new Error(`no payroll account found`);
    }

    let payroll_payments = await models.PayrollPayment.findAll({ where: {

      payroll_account_id: payroll_account.id,

      payroll_batch_id: {
        [Op.gt]: 0
      }

    }});

    let payroll_batches = await models.PayrollBatch.findAll({ where: {

      id: {
        [Op.in]: payroll_payments.map(p => p.payroll_batch_id)
      }

    }});

    return {

      payroll_account,

      payroll_payments,

      payroll_batches

    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}
