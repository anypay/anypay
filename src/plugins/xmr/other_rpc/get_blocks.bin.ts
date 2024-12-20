
export const method = '/get_blocks_by_height.bin'

export const description = 'Get blocks by height. Binary request.'

export interface Inputs {
    heights: number[];
}

export interface Outputs {
    blocks: any[];
    status: string;
    untrusted: boolean;
}
