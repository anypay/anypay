#!/usr/bin/env ts-node

require('dotenv').config();

import * as roi from '../lib/roi';

(async function() {

  try {

   let mail = await roi.send_all_roi_email()

  } catch(error) {

    console.error(error.message);
  }

})();

