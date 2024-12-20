
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#relay_tx'

export const method = 'relay_tx'

export const description = 'Relay a transaction previously created with "do_not_relay":true.'

export interface Inputs {
    hex: string;
}

export interface Outputs {
    tx_hash: string;
}