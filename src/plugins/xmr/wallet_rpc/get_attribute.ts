
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_attribute'

export const method = 'get_attribute'

export const description = 'Get attribute value by name.'

export interface Inputs {
    key: string;
}

export interface Outputs {
    value: string;
}