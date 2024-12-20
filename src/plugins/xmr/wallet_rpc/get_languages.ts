
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_languages'

export const method = 'get_languages'

export const description = "Get a list of available languages for your wallet's seed."

export interface Inputs {
}

export interface Outputs {
    languages: string[];
}