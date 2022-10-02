
export const method = '/get_transaction_pool_hashes.bin'

export const description = 'Get hashes from transaction pool. Binary request'

export interface Inputs {
    // None

}

export interface Outputs {
    status: string;
    tx_hashes: Buffer[];
    untrusted: boolean;
}
