#!/usr/bin/env ts-node

import { verify } from '../';

import { log, models } from '../../../lib'

export async function verify_payment_outputs() {

  const payments = await models.Payment.findAll({
    where: {
      currency: 'XMR',
      //confirmation_date: null
    }
  })

  for (let payment of payments) {

    try {

      log.info('xmr.verify', {
        invoice_uid: payment.invoice_uid,
        tx_hash: payment.txid,
        tx_key: payment.tx_key
      })

      const result = await verify({
          invoice_uid: payment.invoice_uid,
          tx_hash: payment.txid,
          tx_key: payment.tx_key
      })
  
      log.info('xmr.verify.result', result)

      console.log('__OUTPUTS__', result)

    } catch(error) {

      log.error('xmr.verify.error', error)
      console.log('---ERROR---', error)
    }

  }

}

if (require.main === module) {

  (async () => {

    await verify_payment_outputs();
  
    process.exit(0);
  
  })()
  
}
