
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_account_tags'

export const method = 'get_account_tags'

export const description = 'Get a list of user-defined account tags.'

export interface Inputs {
    // None
}

interface AccountTag {
    tag: string;
    label: string;
    accounts: number[];
}

export interface Outputs {
    account_tags: AccountTag[];
}