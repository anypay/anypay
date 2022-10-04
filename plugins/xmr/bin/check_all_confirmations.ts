
import { check_confirmations } from '../';

import { models } from '../../../lib'

import { ensureInvoice } from '../../../lib/invoices';

export async function check_all_confirmations() {

  const payments = await models.Payment.findAll({
    where: {
      currency: 'XMR',
      confirmation_date: null
    }
  })

  for (let payment of payments) {

    console.log(payment)

    const invoice = await ensureInvoice(payment.invoice_uid)

    const result = await check_confirmations(invoice)

    console.log(result)
  }

}

if (require.main === module) {

  (async () => {

    await check_all_confirmations();
  
    process.exit(0);
  
  })()
  
}
