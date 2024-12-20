
export const method = 'hard_fork_info'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Look up information regarding hard fork voting and readiness.'


export interface Inputs {
    // None
}

export interface Outputs {
    credits: number;
    earliest_height: number;
    enabled: boolean;
    state: number;
    status: string;
    threshold: number;
    top_hash: string;
    untrusted: boolean;
    version: number;
    votes: number;
    voting: number;
    window: number;
}