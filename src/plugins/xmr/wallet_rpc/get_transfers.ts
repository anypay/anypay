
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#get_transfers'

export const method = 'get_transfers'

export const description = 'Returns a list of transfers.'

import { Transfer } from './get_transfer_by_txid'

export interface Inputs {
    in: boolean;
    out: boolean;
    pending: boolean;
    failed: boolean;
    pool: boolean;
    filter_by_height: boolean;
    min_height: number;
    max_height: number;
    account_index: number;
    subaddr_indices: number[];
}

export interface Outputs {
    in?: Transfer[];
    out?: Transfer[];
    pending?: Transfer[];
    failed?: Transfer[];
    pool?: Transfer[];
}