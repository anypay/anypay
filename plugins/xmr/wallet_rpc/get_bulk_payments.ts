
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_bulk_payments'

export const description = 'Get a list of incoming payments using a given payment id, or a list of payments ids, from a given height. This method is the preferred method over get_paymentsbecause it has the same functionality but is more extendable. Either is fine for looking up transactions by a single payment ID.'

export const method = 'get_bulk_payments'

export interface Inputs {
    payment_ids: string[];
    min_block_height: number;
}

interface SubaddrIndex {
    major: number;
    minjor: number;
}

interface Payment {
    payment_id: string;
    tx_hash: string;
    amount: number;
    block_height: number;
    unlock_time: number;
    subaddr_index: SubaddrIndex;
    address: string;
}

export interface Outputs {
    payments: Payment[]
}