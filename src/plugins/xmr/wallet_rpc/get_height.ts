
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_height'

export const method = 'get_height'

export const description = "Returns the wallet's current block height."

export interface Inputs {
    // None
}

export interface Outputs {
    height: number;
}