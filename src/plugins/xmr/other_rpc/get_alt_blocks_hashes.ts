
export const method = '/get_alt_blocks_hashes'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get the known blocks hashes which are not on the main chain.'

export interface Inputs {
    // None
}

export interface Outputs {
    blks_hashes: string[];
    credits: number;
    status: string;
    top_hash: string;
    untrusted: boolean;
}