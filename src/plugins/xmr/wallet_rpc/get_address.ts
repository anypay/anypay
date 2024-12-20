
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_address'

export const method = 'get_address'

export const description = "Return the wallet's addresses for an account. Optionally filter for specific set of subaddresses."

export interface Inputs {
    account_index: number;
    address_index?: number;
}

interface Address {
    address: string;
    address_index: number;
    label: string;
    used: boolean;
}

export interface Outputs {
    address: string;
    addresses: Address[];
}