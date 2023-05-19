
export interface UTXO {
  txid: string;
  vout: number;
  address: string;
  account: string;
  scriptPubKey: string;
  value: number;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  safe: boolean;
}


