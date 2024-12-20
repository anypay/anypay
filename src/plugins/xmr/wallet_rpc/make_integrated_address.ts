
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#make_integrated_address'

export const method = 'make_integrated_address'

export const description = 'Make an integrated address from the wallet address and a payment id.'

export interface Inputs {
    standard_address?: string;
    payment_id?: string;
}

export interface Outputs {
    integrated_address: string;
    payment_id: string;
}