
export interface BitcoreIoUtxo {
    _id: string;
    chain: string;
    network: string;
    coinbase: boolean;
    mintIndex: number;
    spentTxid: string;
    mintTxid: string;
    mintHeight: number;
    spentHeight: number;
    address: string;
    script: string;
    value: number;
    confirmations: number;
}
