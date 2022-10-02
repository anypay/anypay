
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_transfer_by_txid'

export const method = 'get_transfer_by_txid'

export const description = 'Show information about a transfer to/from this address.'

export interface Inputs {
    txid: string;
    account_index: number;
}

interface Destination {
    amount: number;
    address: string;
}

interface SubaddrIndex {
    major: number;
    minor: number;
}

export interface Transfer {
    address: string;
    amount: Number;
    confirmations: number;
    destinations: Destination[];
    double_spend_seen: boolean;
    fee: number;
    height: number;
    note: number;
    payment_id: string;
    subaddr_index: SubaddrIndex;
    suggested_confirmations_threshold: number;
    timestamp: number;
    txid: string;
    type: string;
    unlock_time: number;
}

export interface Outputs {
    transfer: Transfer;
}