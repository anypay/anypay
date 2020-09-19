#!/usr/bin/env ts-node

require('dotenv').config();
import {unpaidInvoiceEmail} from '../lib/email';

(async function() {

  try {

    //let accountId = 1176; // steven@anypayinc.com
    let accountId = 177; // derrickjfreeman@gmail.com
    let invoiceId = 606;

    let mail = await unpaidInvoiceEmail(invoiceId);

    console.log('mail', mail);

  } catch(error) {

    console.error(error.message);
  }

})();
