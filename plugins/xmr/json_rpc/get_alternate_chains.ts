
export const method = 'get_alternate_chains'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Display alternative chains seen by the node.'


export interface Inputs {
    // None
}

interface Chain {
    block_hash: string;
    block_hashes: string[];
    difficulty: number;
    difficulty_top64: number;
    height: number;
    length: number;
    main_chain_parent_block: string;
    wide_difficulty: string;
}

export interface Outputs {
    chains: Chain[];
    status: string;
    untrusted: boolean;
}