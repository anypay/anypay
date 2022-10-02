
export const method = '/in_peers'

export const description = 'Limit number of Incoming peers.'

export interface Inputs {
    in_peers: number;
}

export interface Outputs {
    in_peers: number;
    status: string;
    untrusted: boolean;
}
