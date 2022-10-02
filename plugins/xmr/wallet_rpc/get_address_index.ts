
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_address_index'

export const method = 'get_address_index'

export const description = 'Get account and address indexes from a specific (sub)address'

export interface Inputs {
    address: string;
}

interface AddressIndex {
    major: number;
    minor: number;
}

export interface Outputs {
    index: AddressIndex;
}