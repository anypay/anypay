
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_tx_key'

export const method = 'get_tx_key'

export const description = 'Get transaction secret key from transaction id.'

export interface Inputs {
    txid: string;
}

export interface Outputs {
    tx_key: string;
}