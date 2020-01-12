#!/usr/bin/env ts-node

import * as telegram from '../lib/telegram';


(async function() {

  await telegram.notifyDashBackBalance();

})();


