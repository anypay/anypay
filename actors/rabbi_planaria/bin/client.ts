
require('dotenv').config();

import * as datapay from 'datapay';

import * as uuid from 'uuid'

(async () => {

  /*datapay.send({
    safe: true,
    data: [
      "1NRKGVUJGJER9MFUdPcHqdXAJvmrwwCoiT",
      "exchange",
      "routingkey",
      "message"
    ],
    pay: { key: process.env.DATAPAY_WIF }

  }, console.log)
  */

  datapay.send({
    safe: true,
    data: [
      "1NRKGVUJGJER9MFUdPcHqdXAJvmrwwCoiT",
      "rabbi",
      "rabbi_planaria",
      uuid.v4()
    ],
    pay: { key: process.env.DATAPAY_WIF }

  }, console.log)



})();

