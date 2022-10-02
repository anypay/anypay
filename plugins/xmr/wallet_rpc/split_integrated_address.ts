
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#split_integrated_address'

export const method = 'split_integrated_address'

export const description = 'Retrieve the standard address and payment id corresponding to an integrated address.'

export interface Inputs {
    integrated_address: string;
}

export interface Outputs {
    is_subaddress: boolean;
    payment: string;
    standard_address: string;
}
