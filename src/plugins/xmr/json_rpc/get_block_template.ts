
export const method = 'get_block_template'

export const alias = 'getblocktemplate'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get a block template on which mining a new block.'

export interface Inputs {
    wallet_address: string;
    reserve_size: number;
}

export interface Outputs {
    blocktemplate_blob: string;
    blockhashing_blob: string;
    difficulty: number;
    difficulty_top64: number;
    expected_reward: number;
    height: number;
    next_seed_hash: string;
    prev_hash: string;
    reserved_offset: number;
    seed_hash: string;
    status: string;
    untrusted: boolean;
    wide_difficulty: string;
}