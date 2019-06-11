
interface Payment {
  hash: string;
  amount: number;
  address: string;
  currency: string;
}

function rawTxToPayment(message): Payment[] {
  var hash = message.txid;

  return message.vout.filter(vout => {

    return (!!vout.scriptPubKey.addresses);

  }).map(vout => {

    return {
      hash,
      amount: vout.value,
      address: vout.scriptPubKey.addresses[0],
      currency: 'DASH'
    }
  });
}

export { rawTxToPayment };

