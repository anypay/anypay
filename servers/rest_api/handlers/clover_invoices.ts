import { Request, ResponseToolkit } from 'hapi';
import { badRequest } from 'boom';
import { models } from '../../../lib';
import * as Sequelize from 'sequelize';

import { create as createInvoice } from './invoices'

export async function create(req, h: ResponseToolkit) {

  try {

    let cloverAuth = await models.CloverAuth.findOne({

      where: {
        merchant_id: req.params.merchant_id
      }
    })

    console.log('CLOVER AUTH', cloverAuth.toJSON())

    req.account = { id: cloverAuth.account_id }

    return createInvoice(req, h)

  } catch(error) {

    return badRequest(error.message);

  }

}
