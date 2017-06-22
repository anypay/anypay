#!/usr/bin/env node

const http = require('superagent');

const invoice = process.argv[2];
const token = process.env.BLOCKCYPHER_TOKEN;

http
  .delete(`https://api.blockcypher.com/v1/dash/main/hooks/${invoice}?token=${token}`)
  .end((error, response) => {
    console.log(error);
    console.log(response.body);
  });

