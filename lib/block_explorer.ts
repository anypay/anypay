
interface Payment {
  currency: string;
  txid: string;
}

export function getBlockExplorerTxidUrl(payment: Payment): string {

  switch (payment.currency) {

  case 'DOGE':
    return `https://blockchair.com/dogecoin/transaction/${payment.txid}`
  case 'BTC':
    return `https://blockchair.com/bitcoin/transaction/${payment.txid}`
  case 'LTC':
    return `https://blockchair.com/litecoin/transaction/${payment.txid}`  
  case 'XMR':
    return `https://blockchair.com/monero/transaction/${payment.txid}`
  case 'BCH':
    return `https://blockchair.com/bitcoincash/transaction/${payment.txid}`
  case 'DASH':
    return `https://blockchair.com/dash/transaction/${payment.txid}`
  case 'BSV':
    return `https://whatsonchain.com/tx/${payment.txid}`;
  }
  
}
