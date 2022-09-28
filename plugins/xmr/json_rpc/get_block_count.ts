
export const method = 'get_block_count'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Look up how many blocks are in the longest chain known to the node.'


export interface Inputs {
    // None
}

export interface Outputs {
    count: number;
    status: string;
    untrusted: boolean;
}