
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#submit_transfer'

export const method = 'submit_transfer'

export const description = 'Submit a previously signed transaction on a read-only wallet (in cold-signing process).'

export interface Inputs {
    tx_data_hex: string;
}

export interface Outputs {
    tx_hash_list: string[];
}