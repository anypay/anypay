
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#make_uri'

export const method = 'make_uri'

export const description = 'Create a payment URI using the official URI spec.'

export interface Inputs {
    address: string;
    amount?: number;
    payment_id?: string;
    recipient_name?: string;
    tx_description?: string;
}

export interface Outputs {
    uri: string;
}