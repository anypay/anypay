
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#untag_accounts'

export const method = 'untag_accounts'

export const description = 'Remove filtering tag from a list of accounts.'


export interface Inputs {
    accounts: number[];
}

export interface Outputs {
    // None
}