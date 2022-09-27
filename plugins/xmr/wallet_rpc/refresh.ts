
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#refresh'

export const method = 'refresh'

export const description = 'Refresh a wallet after openning.'

export interface Inputs {
    start_height: number;
}

export interface Outputs {
    blocks_fetched: number;
    received_money: boolean;
}