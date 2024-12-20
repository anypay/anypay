
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_payments'

export const method = 'get_payments'

export const description = 'Get a list of incoming payments using a given payment id.'

export interface Inputs {
    payment_id: number;
}

interface SubaddrIndex {
    major: number;
    minor: number;
}

interface Payment {
    payment_id: string;
    tx_hash :string;
    amount: number;
    block_height: number;
    unlock_time: number;
    subaddr_index: SubaddrIndex;
    address: string;
}

export interface Outputs {
    payments: Payment[];
}