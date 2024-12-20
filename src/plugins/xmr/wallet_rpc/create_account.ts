
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#create_account'

export const method = 'create_account'

export const description = 'Create a new account with an optional label.'

export interface Inputs {
    label?: string;
}

export interface Outputs {
    account_index: number;
    address: string;
}