#!/usr/bin/env ts-node

import { generateAdminToken } from '../lib/jwt';

(async () => {

  let token = await generateAdminToken();

  console.log(token);

})()

