
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#transfer_split'

export const method = 'transfer_split'

export const description = 'Same as transfer, but can split into more than one tx if necessary.'

import { Destination } from './transfer'

export interface Inputs {
    destinations: Destination[];
    account_index?: number;
    subaddr_indicies?: number[];
    mixin?: number;
    ring_size?: number;
    unlock_time?: number;
    payment_id?: string;
    get_tx_keys?: boolean;
    priority?: number;
    do_not_relay?: boolean;
    get_tx_hex?: boolean;
    new_algorithm?: boolean;
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