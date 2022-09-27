
export const method = '/out_peers'

export const description = 'Limit number of Outgoing peers.'

export interface Inputs {
    out_peers: number;
}

export interface Outputs {
    out_peers: number;
    status: string;
    untrusted: boolean;
}
