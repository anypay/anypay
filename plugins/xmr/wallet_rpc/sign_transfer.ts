
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#sign_transfer'

export const method = 'sign_transfer'

export const description = 'Sign a transaction created on a read-only wallet (in cold-signing process)'

export interface Inputs {
    unsigned_txset: string;
    export_raw: boolean;
}

export interface Outputs {
    signed_txset: string;
    tx_hash_list: string[];
    tx_raw_list: string[];
}