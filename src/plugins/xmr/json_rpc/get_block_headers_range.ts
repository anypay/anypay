import { BlockHeader } from "@/plugins/xmr/json_rpc/get_last_block_header";

export const method = 'get_block_headers_range'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Similar to get_block_header_by_height above, but for a range of blocks. This method includes a starting block height and an ending block height as parameters to retrieve basic information about the range of blocks.'


export interface Inputs {
    start_height: number;
    end_height: number;
}

export interface Outputs {
    credits: number;
    headers: BlockHeader[];
    status: string;
    top_hash: string;
    untrusted: boolean;
}