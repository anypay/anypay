

export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_version'

export const method = 'get_version'

export const description = 'Get RPC version Major & Minor integer-format, where Major is the first 16 bits and Minor the last 16 bits.'

export interface Inputs {
    // None
}

export interface Outputs {
    version: number;
}