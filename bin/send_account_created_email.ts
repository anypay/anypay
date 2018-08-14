#!/usr/bin/env ts-node

require('dotenv').config();
import {newAccountCreatedEmail} from '../lib/email';

(async function() {

  try {

    //let accountId = 1176; // steven@anypay.global
    let accountId = 177; // derrickjfreeman@gmail.com

    let mail = await newAccountCreatedEmail(accountId);

    console.log('mail', mail);

  } catch(error) {

    console.error(error.message);
  }

})();
