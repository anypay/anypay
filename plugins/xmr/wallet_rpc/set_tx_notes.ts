
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#set_tx_notes'

export const method = 'set_tx_notes'

export const description = 'Set arbitrary string notes for transactions.'

export interface Inputs {
    txids: string[];
    notes: string[];
}

export interface Outputs {
    // None
}