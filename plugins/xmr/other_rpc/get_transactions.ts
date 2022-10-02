
export const description = 'Look up one or more transactions by hash'

export const path = '/get_transactions'

export interface Inputs {
    tx_hashes: string[];
    decode_as_json: boolean; // false
    prune: boolean; // false
}

interface TxJson {
    version: number;
    unlock_time: number;
    vin: any[];
    vout: any[];
    extra: string;
    signatures: string[];
    blcok_height: number;
    block_timestamp: number;
    double_spend_seed: boolean;
    in_pool: boolean;
    output_indices: number[];
    prunable_as_hex: string;
    prunable_hash: string;
    pruned_as_hex: string;
    tx_hash: string;
}

interface TxEntry {
    as_hex: string;
    as_json: TxJson;
}

export interface Outputs {
    missed_tx?: string[];
    status: string;
    top_hash: string;
    txs: TxEntry[];
    txs_as_hex: string;
    txs_as_json?: string;
}