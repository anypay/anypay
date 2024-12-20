import {awaitChannel} from '@/lib/amqp';
import * as Boom from '@hapi/boom';

import { config, log } from '@/lib'

import { find } from '@/lib/plugins'

import * as pay from '@/lib/pay'
import { Trace } from '@/lib/trace';
import { Request, ResponseToolkit } from '@hapi/hapi';
import prisma from '@/lib/prisma';

const bitcoin = require('bsv'); 
const Message = require('bsv/message'); 


export async function show(request: Request, h: ResponseToolkit) {

  let currency: pay.Currency = pay.getCurrency({
    protocol: 'BIP70',
    headers: request.headers
  })

  log.info(`bip70.currency.parsed`, currency)

  let paymentRequest: pay.PaymentRequest = await pay.buildPaymentRequestForInvoice({
    uid: request.params.uid,
    currency: currency.code,
    protocol: 'BIP70'
  })

  log.info(`bip70.${currency.code.toLowerCase()}.paymentrequest.content`)

  ;(async () => {

    let hex = paymentRequest.content.serialize().toString('hex')

    let record = await prisma.bip70PaymentRequests.findFirst({
      where: {
        invoice_uid: request.params.uid,
        currency: currency.code
      }
    })

    if (!record) {
      prisma.bip70PaymentRequests.create({
        data: {
          invoice_uid: request.params.uid,
          currency: currency.code,
          hex,
          createdAt: new Date(),
          updatedAt: new Date()
        }    
      })
    }

  })();

  let digest = bitcoin.crypto.Hash.sha256(Buffer.from(JSON.stringify(paymentRequest.content))).toString('hex');

  let response = h.response(paymentRequest.content.serialize());

  if (config.get('JSON_PROTOCOL_IDENTITY_WIF')) {

    var privateKey = bitcoin.PrivateKey.fromWIF(config.get('JSON_PROTOCOL_IDENTITY_WIF'));
    var signature = Message(digest).sign(privateKey);
    response.header('x-signature-type', 'ecc');
    response.header('x-identity', String(config.get('JSON_PROTOCOL_IDENTITY_ADDRESS')) );
    response.header('signature', Buffer.from(signature, 'base64').toString('hex'));
    response.header('digest', `SHA-256=${digest}`);

  }

  response.type(`application/${currency.name}-paymentrequest`);

  response.header('Content-Type', `application/${currency.name}-paymentrequest`);
  response.header('Accept', `application/${currency.name}-payment`);

  return response;

}

export async function create(request: Request, h: ResponseToolkit) {

  let channel = await awaitChannel();

  let currency: pay.Currency = pay.getCurrency({
    protocol: 'BIP70',
    headers: request.headers
  })

  log.info(`bip70.currency.parsed`, currency)

  let plugin = find({chain: currency.code, currency: currency.code})

  let payment = pay.BIP70Protocol.Payment.decode(request.payload);

  await channel.publish('anypay', `bip70.payments.${currency.code.toLowerCase()}`, payment);

  log.info('bip70.payment.decoded', payment);

  let payment_option = await prisma.payment_options.findFirstOrThrow({
    where: {
      invoice_uid: request.params.uid,
      currency: currency.code
    }
  });

  const invoice = await prisma.invoices.findFirstOrThrow({
    where: {
      uid: request.params.uid
    }
  })

  if (invoice.cancelled) {

    log.error('payment.error.invoice.cancelled', new Error('invoice cancelled'))
    return Boom.badRequest('invoice cancelled')
  }

  for (let transaction of payment.transactions) {

    ;(async () => {

      try {

        await prisma.paymentSubmissions.create({
          data: {
            invoice_uid: invoice.uid,
            txhex: transaction.toString('hex'),
            headers: request.headers,
            wallet: null,
            protocol: 'bip70',
            currency: payment_option.currency,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

  
      } catch(error: any) {

        log.info('PaymentSubmission.create.error', {
          invoice_uid: invoice.uid,
          txhex: transaction.toString('hex'),
          headers: request.headers,
          wallet: null,
          protocol: 'bip70',
          currency: payment_option.currency,
          error
        })
        
        log.error('PaymentSubmission.create', error)
  
      }

    })();
 
  }

  for (const tx of payment.transactions) {

    let transaction: string = tx.toString('hex') 

    await pay.verifyPayment({
      payment_option: {
        invoice_uid: payment_option.invoice_uid,
        chain: payment_option.chain,
        currency: payment_option.currency,
        address: payment_option.address,
        amount: payment_option.amount?.toNumber(),
        fee: Number(payment_option.fee),
        outputs: payment_option.outputs as Array<any>

      },
      transaction: {txhex: transaction},
      protocol: 'BIP70'
    })

    log.info(`bip70.${payment_option.currency}.transaction`, { hex: transaction });

    const trace = Trace()

    try {

      log.info(`bip70.${payment_option.currency}.broadcast`, { transaction, trace })

      let resp = await plugin.broadcastTx({ txhex: transaction });

      log.info(`bip70.${payment_option.currency}.broadcast.result`, { result: resp, trace })

      
    } catch(error: any) {

      log.error(`bip70.${payment_option.currency}.broadcast.error`, error)

      throw error

    }

    let paymentRecord = await pay.completePayment(payment_option, { txhex: transaction})

    log.info(`bip70.${payment_option.currency}.payment.completed`, paymentRecord);

  }

  let ack = new pay.BIP70Protocol.PaymentACK();

  ack.set('payment', payment);

  let response = h.response(ack.toBuffer());

  response.type(`application/${currency.name}-paymentack`);

  return response;

}

