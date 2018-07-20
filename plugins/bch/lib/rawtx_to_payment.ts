
function rawTxToPayment(message) {
  var hash = message.result.txid;

  return message.result.vout.filter(vout => {

    return (!!vout.scriptPubKey.addresses);

  }).map(vout => {

    return {
      hash,
      amount: vout.value,
      address: vout.scriptPubKey.addresses[0],
      currency: 'BCH'
    }
  });
}

export { rawTxToPayment };

