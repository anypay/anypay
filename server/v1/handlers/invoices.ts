
const _ = require('lodash')

import { log, models } from '../../../lib';

import { Invoice, createInvoice } from '../../../lib/invoices'

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

export async function show(request, hapi) {

  try {

    let invoice = await models.Invoice.findOne({ where: { uid: request.params.invoice_uid }})

    if (!invoice) {

      return hapi.response({ error: 'invoice not found' }).code(404)

    }

    let payment = await models.Payment.findOne({ where: { invoice_uid: invoice.uid }})

    var response = {
      invoice: {
        currency: invoice.denomination,
        amount: invoice.denomination_amount,
        status: invoice.status,
        createdAt: invoice.createdAt
      }
    }

    if (payment) { response['payment'] = payment.toJSON() }

    response['kraken_deposits'] = await models.KrakenDeposit.findAll({
      where: {
        account_id: invoice.account_id,
        txid: invoice.hash
      }
    })

    return hapi.response(response).code(200)

  } catch(error) {

    console.error('invoic.show.error', error)

    return hapi.response({ error: error.message }).code(500)

  }

}

export async function create (request, h) {

  // TODO: Refactor to call only a SINGLE core library method

  log.info('api.v1.invoices.create', Object.assign({
    account_id: request.account.id
  }, request.payload))

  let invoice = await createInvoice({
    account: request.account,
    amount: request.payload.amount,
    currency: request.payload.currency,
    external_id: request.payload.external_id,
    business_id: request.payload.business_id,
    location_id: request.payload.location_id,
    register_id: request.payload.register_id,
    webhook_url: request.payload.webhook_url,
    redirect_url: request.payload.redirect_url,
    memo: request.payload.memo,
    fee_rate_level: request.payload.fee_rate_level,
    wordpress_site_url: request.payload.wordpress_site_url,
    email: request.payload.email
  })

  const additional: InvoiceAdditions = {}

  additional.is_public_request = request.is_public_request

  additional.headers = request.headers

  await invoice.update(additional)

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
