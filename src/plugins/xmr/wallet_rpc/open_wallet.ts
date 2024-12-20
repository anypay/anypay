
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#open_wallet'

export const method = 'open_wallet'

export const description = 'Open a wallet. You need to have set the argument "–wallet-dir" when launching monero-wallet-rpc to make this work.'

export interface Inputs {
    filename: string;
    password?: string;
}

export interface Outputs {
    // None
}