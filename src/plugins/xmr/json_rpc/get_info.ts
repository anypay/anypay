
export const method = 'get_info'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Retrieve general information about the state of your node and the network.'


export interface Inputs {

    // None

}

export interface Outputs {

    adjusted_time: number;
    alt_blocks_count: number;
    block_size_limit: number;
    block_size_median: number;
    block_weight_limit: number;
    block_weight_median: number;
    bootstrap_daemon_address: string;
    busy_syncing: boolean;
    credits: number;
    cumulative_difficulty: number;
    cumulative_difficulty_top64: number;
    database_size: number;
    difficulty: number;
    difficulty_top64: number;
    free_space: number;
    grey_peerlist_size: number;
    height: number;
    height_without_bootstrap: number;
    incoming_connections_count: number;
    mainnet: boolean;
    nettype: string;
    offline: boolean;
    outgoing_connections_count: number;
    rpc_connections_count: number;
    stagenet: boolean;
    start_time: number;
    status: string;
    synchronized: boolean;
    target: number;
    target_height: number;
    testnet: boolean;
    top_block_hash: string;
    top_hash: string;
    tx_count: number;
    tx_pool_size: number;
    untrusted: boolean;
    update_available: boolean;
    version: string;
    was_boostrap_ever_used: boolean;
    white_peerlist_size: number;
    wide_cumulative_difficulty: number;
    wide_difficulty: string;
}