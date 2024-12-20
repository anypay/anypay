
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#tag_accounts'

export const method = 'tag_accounts'

export const description = 'Apply a filtering tag to a list of accounts.'

export interface Inputs {
    tag: string;
    accounts: number[];
}

export interface Outputs {
    // None
}