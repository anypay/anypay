
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#set_attribute'

export const method = 'set_attribute'

export const description = 'Set arbitrary attribute.'

export interface Inputs {
    key: string;
    value: string;
}

export interface Outputs {
    // None
}