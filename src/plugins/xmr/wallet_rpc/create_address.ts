
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#create_address'

export const description = 'Create a new address for an account. Optionally, label the new address.'

export const method = 'create_address'

export interface Inputs {
    account_index: number;
    label?: string;
}

export interface Outputs {
    address: string;
    address_index: number;
}
