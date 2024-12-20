
export const method = 'get_fee_estimate'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Gives an estimation on fees per byte.'


export interface Inputs {
    grace_blocks: number;
}

export interface Outputs {
    credits: number;
    fee: number;
    quantization_mask: number;
    status: string;
    top_hash: string;
    untrusted: boolean;
}
