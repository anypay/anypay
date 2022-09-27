
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#sweep_all'

export const method = 'sweep_all'

export const description = 'Send all unlocked balance to an address.'

export interface Inputs {
    address: string;
    account_index: number;
    subaddr_indicies?: number[];
    priority?: number;
    mixin: number;
    ring_size: number;
    unlock_time: number;
    payment_id?: string;
    get_tx_keys?: boolean;
    below_amount?: number;
    do_not_relay?: boolean;
    get_tx_hex?: boolean;
    get_tx_metadata?: boolean;
}

export interface Outputs {
    tx_hash_list: string[];
    tx_key_list: string[];
    amount_list: number[];
    fee_list: number[];
    tx_blob_list: string[];
    tx_metadata_list: string[];
    multisig_txset: string;
    unsigned_txset: string;
}