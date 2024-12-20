
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_tx_notes'

export const method = 'get_tx_notes'

export const description = 'Get string notes for transactions.'

export interface Inputs {
    txids: string[];
}

export interface Outputs {
    notes: string[];
}