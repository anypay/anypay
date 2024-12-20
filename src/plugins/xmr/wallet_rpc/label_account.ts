
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#label_account'

export const method = 'label_account'

export const description = 'Label an account.'

export interface Inputs {
    account_index: number;
    label: string;
}

export interface Outputs {
    // None
}