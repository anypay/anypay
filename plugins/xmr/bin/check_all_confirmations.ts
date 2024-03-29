
import { check_confirmations } from '../';

import { ensureInvoice } from '../../../lib/invoices';
import prisma from '../../../lib/prisma';

(async () => {

  const payments = await prisma.payments.findMany({
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

  process.exit(0);

})()
