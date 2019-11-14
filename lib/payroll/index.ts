
import * as moment from 'moment';
import { models } from '../models';

export async function createBatch(date?: Date) {

  if (!date) {

    date = new Date();

  } else {

    date = moment(date).toDate();

  }

  let payroll_batch = await models.PayrollBatch.create({
    payroll_date: date
  });

  let payroll_accounts = await models.PayrollAccount.findAll({

    where: {

      active: true

    }

  });

  let payroll_payments = await Promise.all(payroll_accounts.map(payroll_account => {

    return models.PayrollPayment.create({

      payroll_batch_id: payroll_batch.id,

      payroll_account_id: payroll_account.id

    });
  
  }));

  return { payroll_batch, payroll_accounts, payroll_payments }

}

