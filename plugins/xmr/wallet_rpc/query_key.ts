
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#query_key'

export const method = 'query_key'

export const description = 'Return the spend or view private key.'

export interface Inputs {
    key_type: string;
}

export interface Outputs {
    key: string;
}