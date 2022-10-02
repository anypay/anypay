
export const method = '/get_hashes.bin'

export const description = 'Get hashes. Binary request.'

export interface Inputs {
    block_ids: Buffer[];
    start_height: number;
}

export interface Outputs {
    current_height: number;
    m_block_ids: Buffer[];
    start_height: number;
    status: string;
    untrusted: boolean;
}
