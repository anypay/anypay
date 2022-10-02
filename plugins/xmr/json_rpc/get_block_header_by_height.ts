import { BlockHeader } from "./get_last_block_header";

export const method = 'get_block_header_by_height'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = "Similar to get_block_header_by_hash above, this method includes a block's height as an input parameter to retrieve basic information about the block."


export interface Inputs {
    height: number;
}

export interface Outputs {
    block_header: BlockHeader;
    status: string;
    untrusted: boolean;
}