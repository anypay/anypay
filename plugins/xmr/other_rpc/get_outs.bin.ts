
export const method = '/get_outs.bin'

export const description = 'Get outputs. Binary request.'

interface GetOutputsOut {
    amount: number;
    index: number;
}

export interface Inputs {
    outputs: GetOutputsOut[]
}

interface Outkey {
    amount: number;
    height: number;
    key: string;
    mask: string;
    txid: string;
    unlocked: boolean;
}

export interface Outputs {
    outs: Outkey[];
    status: string;
    untrusted: boolean;
}
