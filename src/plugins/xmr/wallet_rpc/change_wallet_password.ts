
// https://monerodocs.org/interacting/monero-wallet-rpc-reference/#change_wallet_password

export const method = 'change_wallet_password'

export const description = 'Change a wallet password.'

export interface Inputs {
    old_password?: string;
    new_password?: string;
}