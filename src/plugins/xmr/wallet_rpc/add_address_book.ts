
// https://monerodocs.org/interacting/monero-wallet-rpc-reference/#add_address_book

export const method = 'add_address_book'

export const description = 'Add an entry to the address book.'

export interface Inputs {
    address: string;
    payment_id?: string;
    description?: string;
}

export interface Outputs {
    index: number;
}
