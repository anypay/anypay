
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#set_account_description_tag'

export const method = 'set_account_description_tag'

export const description = 'Set description for an account tag.'

export interface Inputs {
    tag: string;
    description: string;
}

export interface Outputs {
    // None
}