#!/usr/bin/env ts-node

require('dotenv').config();
import {sendEmail} from '../lib/email';

(async function() {

  try {

    let mail = await sendEmail('steven@anypay.global', 'hello test', 'some body');

    console.log('mail', mail);

  } catch(error) {

    console.error(error.message);
  }

})();
