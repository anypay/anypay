
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_tx_proof'

export const method = 'get_tx_proof'

export const description = 'Get transaction signature to prove it.'

export interface Inputs {
    txid: string;
    address: string;
    message?: string;
}

export interface Outputs {
    signature: string;
}