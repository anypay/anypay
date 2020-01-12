#!/usr/bin/env ts-node

import * as telegram from '../lib/telegram';


(async function() {

  if (process.argv[2]) {

    await telegram.sendMessage(process.argv[2]);

  } else {

    console.log('usage: ./bin/message_telegram.ts "My message to the chat"');

  }

})();


