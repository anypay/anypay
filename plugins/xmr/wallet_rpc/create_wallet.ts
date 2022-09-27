
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#create_wallet'

export const method = 'create_wallet'

export const description = 'Create a new wallet. You need to have set the argument "–wallet-dir" when launching monero-wallet-rpc to make this work.'

export interface Inputs {
    filename: string;
    password?: string;
    language: string;
}

export interface Outputs {
    // None
}