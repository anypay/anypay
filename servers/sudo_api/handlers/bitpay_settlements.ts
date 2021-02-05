
import { models, database } from '../../../lib';
import * as Boom from 'boom';
import * as hapiSequelize from '../../../lib/hapi_sequelize';

import * as bitpay from '../../../lib/bitpay';

import { badRequest } from 'boom';

export async function create(req, h) {

  try {

    let settlement = await bitpay.create(req.payload.invoice_uid);

    return { settlement }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function show(req, h) {

  try {

    let settlement = await models.BitpaySettlement.findOne({
      where: {
        invoice_uid: req.params.invoice_uid
      }
    });

    if (!settlement) {

      return Boom.notFound();
    }

    return { settlement }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function update(req, h) {

  try {

    let settlement = await bitpay.update({
      invoice_uid: req.params.invoice_uid,
      txid: req.payload.txid,
      currency: req.payload.currency,
      amount: req.payload.amount
    });

    return { settlement }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function index(req, h) {

  let { order, limit, offset } = hapiSequelize.parseRequest(req);

  try {

    let settlements = await models.BitpaySettlement.findAll({
      order, limit, offset 
    });

    return {

      settlements
    }

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function notSettled(req, h) {

  try {

    let results = await database.query(`select uid, denomination_amount_paid,
    settlements.txid, external_id, invoices."createdAt" from invoices left join
    settlements on invoices.settlement_id = settlements.id  where status
    !='unpaid' and should_settle = true and txid is null order by "createdAt" asc`)

    return {
      invoices: results[0]
    }


  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

