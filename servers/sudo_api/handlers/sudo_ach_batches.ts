
import { models } from '../../../lib';

import * as Boom from 'boom';

export async function index(req, h) {

  try {

    let resp = await  models.AchBatch.findAll({

      order: [['createdAt', 'DESC']]

    });

    return resp;

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

export async function create(req, h) {

  try {

    if (!req.payload.last_invoice_uid) {

      return Boom.badRequest('last_invoice_uid must be provided in payload');

    }

    let invoice = await models.Invoice.findOne({ where: {

      uid: req.payload.last_invoice_uid

    }});

    if (!invoice) {

      return Boom.badRequest('invoice not found for last_invoice_uid');

    }

    let ach_batch = await  models.AchBatch.create(req.payload);

    return { ach_batch };

  } catch(error) {

    return Boom.badRequest(error.message);

  }

}

