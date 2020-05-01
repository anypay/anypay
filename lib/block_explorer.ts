

export function getBlockExplorerTxidUrl(reward) {

  switch (reward.currency) {

  case 'BCH':
    return  `https://explorer.bitcoin.com/bch/tx/${reward.txid}`;
  case 'DASH':
    return `https://live.blockcypher.com/dash/tx/${reward.txid}/`;
  case 'BSV':
    return `https://whatsonchain.com/tx/${reward.txid}`;
  }
  
}
