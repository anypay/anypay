#!/usr/bin/env node

const blockcypher = require("../lib/blockcypher");
const async = require("async");
const http = require("superagent")

function deletePayment(id, callback) {

  http
    .delete(`https://api.blockcypher.com/v1/btc/main/payments/${id}`)
    .end((error, resp) => {
      console.log('deleted payment', id);
      callback();
    });
}

blockcypher.listPayments().then(payments => {
  
    async.mapSeries(payments, function(payment, callback) {

      return deletePayment(payment.id, callback);
    }, console.log);
});

