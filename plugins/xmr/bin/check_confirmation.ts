
import { check_confirmations } from '../';

import { ensureInvoice } from '../../../lib/invoices';

(async () => {

    const invoice = await ensureInvoice('5c29_JgK9')

    const response = await check_confirmations(invoice)

    console.log(response)

    process.exit(0);

})()
    
