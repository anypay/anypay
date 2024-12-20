import { NameString } from "aws-sdk/clients/athena";

export const method = 'get_last_block_header'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Block header information for the most recent block is easily retrieved with this method. No inputs are needed.'


export interface Inputs {
    // None

}

export interface BlockHeader {
    block_size: number;
    block_weight: number;
    cumulative_difficulty: number;
    cumulative_difficulty_top64: number;
    depth: number;
    difficulty: number;
    hash: string;
    height: number;
    long_term_weight: number;
    major_version: number;
    miner_tx_hash: string;
    minor_version: number;
    nonce: number;
    num_txes: number;
    orphan_status: boolean;
    pow_hash: string;
    prev_hash: string;
    reward: number;
    timestamp: number;
    wide_cumulative_difficulty: number;
    wide_difficulty: string;
}

export interface Outputs {
    block_header: BlockHeader;
    credits: number;
    status: number;
    top_hash: NameString;
    untrusted: boolean;
}