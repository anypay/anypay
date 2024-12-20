
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#check_tx_key'

export const description = 'Check a transaction in the blockchain with its secret key.'

export const method = 'check_tx_key'

export interface Inputs {
    txid: string;
    tx_key: string;
    address: string;
}

export interface Outputs {
    confirmations: number;
    in_pool: boolean;
    received: number;
}