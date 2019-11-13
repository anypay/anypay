
import * as Boom from 'boom';

import { log, models } from '../../../lib';

export async function index(req) {

  let payroll_accounts = await models.PayrollAccount.findAll({
    
    include: [{model: models.Account, as: 'account' }]
    
  });

  return { payroll_accounts }

}

