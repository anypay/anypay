
function rawTxToPayment(message) {
  var hash = message.result.txid;

  return {
    hash,
    amount: message.result.vout[0].value,
    address: message.result.vout[0].scriptPubKey.addresses[0]
  }
}

export { rawTxToPayment };

