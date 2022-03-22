const Boom = require('boom');
const uuid = require('uuid')

const _ = require('lodash')

import { Op } from 'sequelize';

import {plugins} from '../../../lib/plugins';

import { log, prices, email, models, invoices, coins } from '../../../lib';

import { Invoice, createInvoice } from '../../../lib/invoices'

import { recordEvent } from '../../../lib/events'

import * as moment from 'moment';

interface InvoiceAdditions {
  webhook_url?: string;
  redirect_url?: string;
  wordpress_site_url?: string;
  tags?: string[];
  external_id?: string;
  is_public_request?: string;
  headers?: string;
  email?: string;
  business_id?: string;
  location_id?: string;
  register_id?: string;
}

export async function setInvoiceAdditions(invoice: Invoice, additions: InvoiceAdditions): Promise<Invoice> {

  return invoice;

}

export async function create (request, h) {

  await recordEvent({

    account_id: request.account.id,

    headers: request.headers,

    payload: request.payload

  }, 'request.invoice.create')

  log.info('invoices.create', Object.assign({

    account_id: request.account.id

  }, request.payload))

  let invoice = await createInvoice({

    account: request.account,

    amount: request.payload.amount

  })

  const additional: InvoiceAdditions = {}

  additional.redirect_url = request.payload.redirect_url

  if (request.payload.wordpress_site_url) {

    additional.wordpress_site_url = request.payload.wordpress_site_url

    additional.tags = ['wordpress']

  }

  additional.webhook_url = request.payload.webhook_url

  additional.external_id = request.payload.external_id;

  additional.is_public_request = request.is_public_request

  additional.headers = request.headers

  additional.email = request.payload.email;

  additional.business_id = request.payload.business_id;

  additional.location_id = request.payload.location_id;

  additional.register_id = request.payload.register_id;

  await invoice.update(additional)

  if (invoice.get('email')) {
    let note = await models.InvoiceNote.create({
      content: `Customer Email: ${invoice.get('email')}`,
      invoice_uid: invoice.uid,
    });
  }

  let payment_options = await getPaymentOptions(invoice)

  return h.response({

    invoice: invoice.toJSON(),

    payment_options

  }).code(201);

};

async function getPaymentOptions(invoice: Invoice) { 

  let payment_options = await models.PaymentOption.findAll({where: {
    invoice_uid: invoice.uid
  }});

  return payment_options.map(option => _.pick(option,
    'uri',
    'currency',
    'amount'
  ))

}

function sanitizeInvoice(invoice) {

  let resp = invoice.toJSON();

  resp.denomination = invoice.currency

  delete resp.webhook_url;

  delete resp.id;

  delete resp.dollar_amount;

  return resp;
}


