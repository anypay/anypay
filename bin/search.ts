#!/usr/bin/env ts-node

require('dotenv').config();

import { search } from '../lib/search';

const argv = require('yargs').argv;

(async function() {

  if (!argv.query) {

    console.log('--query must be provided');

    process.exit(0);

  }

  let result = await search(argv.query)

  for (let item of result) {

    console.log(item.value.toJSON())
  }

  console.log(result)

})();
