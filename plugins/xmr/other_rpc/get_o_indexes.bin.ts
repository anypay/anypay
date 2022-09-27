
export const method = '/get_o_indexes.bin'

export const description = 'Get global outputs of transactions. Binary request.'

export interface Inputs {
    txid: Buffer;
}

export interface Outputs {
    o_indexes: number[];
    status: string;
    untrusted: boolean;
}
