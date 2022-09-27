
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#sweep_dust'

export const method = 'sweep_dust'

export const description = "Send all dust outputs back to the wallet's, to make them easier to spend (and mix)."

export interface Inputs {
    get_tx_keys: boolean;
    do_not_relay: boolean;
    get_tx_hex: boolean;
    get_tx_metadata: boolean;
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
