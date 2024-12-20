
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_address_book'

export const method = 'get_address_book'

export const description = 'Retrieves entries from the address book.'

export interface Inputs {
    entries: number[];
}

interface Entry {
    address: string;
    description: string;
    index: number;
    payment_id: string;
}

export interface Outputs {
    entries: Entry[];
}