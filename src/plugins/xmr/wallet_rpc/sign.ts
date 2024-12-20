
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#sign'

export const method = 'sign'

export const description = 'Sign a string.'

export interface Inputs {
    data: string;
}

export interface Outputs {
    signature: string;
}