
export const path = '/get_height'

export const description = "Get the node's current height."

export interface Inputs {
    // None
}

export interface Outputs {
    hash: string;
    height: number;
    status: string;
    untrusted: boolean;
}