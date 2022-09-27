
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#transfer'

export const method = 'transfer'

export const description = 'Send monero to a number of recipients.'

export interface Destination {
    amount: number;
    address: string;
}

export interface Inputs {
    destinations: Destination[];
    account_index?: number;
    subaddr_indices?: number[];
    priority: number;
    mixin: number;
    ring_size: number;
    unlock_time: number;
    payment_id?: string;
    get_tx_key?: boolean;
    do_not_relay?: boolean;
    get_tx_hex?: boolean;
    get_tx_metadata?: boolean
}

export interface Outputs {
    amount: number;
    fee: number;
    mutisig_txset: string;
    tx_blob: string;
    tx_hash: string;
    tx_key: string;
    tx_metadata: any;
    unsigned_txset: string;
}