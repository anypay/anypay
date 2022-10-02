
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#parse_uri'

export const method = 'parse_uri'

export const description = 'Parse a payment URI to get payment information.'

export interface Inputs {
    uri: string;
}

interface Uri {
    address: string;
    amount: number;
    payment_id: string;
    recipient_name: string;
    tx_description: string;
}

export interface Outputs {
    uri: Uri;
}