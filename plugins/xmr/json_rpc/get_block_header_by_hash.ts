import { BlockHeader } from "./get_last_block_header";

export const method = 'get_block_header_by_hash'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = "Block header information can be retrieved using either a block's hash or height. This method includes a block's hash as an input parameter to retrieve basic information about the block."

export interface Inputs {
    hash: string;
}

export interface Outputs {
    block_header: BlockHeader;
    status: string;
    untrusted: boolean;
}