
export const method = '/get_transaction_pool'

export const description = "Show information about valid transactions seen by the node but not yet mined into a block, as well as spent key image information for the txpool in the node's memory."

export interface Inputs {
    // None

}

export interface TxJson {
    version: number;
    unlock_time: number;
    vin: any[];
    vout: any[];
    extra: string;
    rct_signatures: any[];
    rctsig_prunable: any;
}

interface Transaction {
    blob_size: number;
    do_not_relay: boolean;
    double_spend_seen: boolean;
    fee: number;
    id_hash: string;
    kept_by_block: boolean;
    last_failed_height: number;
    last_failed_id_hash: string;
    last_relayed_time: number;
    max_used_block_height: number;
    max_used_block_hash: string;
    receive_time: number;
    relayed: boolean;
    tx_blob: number;
    tx_json: any;
}

interface SpentKeyImage {
    id_hash: string;
    txs_hashes: string[]
}

export interface Outputs {
    
    credits: number;
    spent_key_images: SpentKeyImage[];
    status: string;
    transactions: Transaction[];
}
