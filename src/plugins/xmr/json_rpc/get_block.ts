import { json_rpc } from "@/plugins/xmr/json_rpc";
import { BlockHeader } from "@/plugins/xmr/json_rpc/get_last_block_header";

export const method = 'get_block'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Full block information can be retrieved by either block height or hash, like with the above block header calls. For full block information, both lookups use the same method, but with different input parameters.'

export default async function(inputs: Inputs): Promise<Outputs> {

    const result = await json_rpc.call<Outputs>('get_block', inputs)

    return result
}

export interface Inputs {
    height?: number;
    hash?: string;
}

interface MinerTx {
    version: number;
    unluck_time: number;
    vin: any[];
    vout: any[];
    extra: string;
    signatures: string;
}

interface BlockDetails {
    major_version: number;
    minor_version: number;
    timestamp: number;
    prev_id: string;
    nonce: string;
    miner_tx: MinerTx;
    tx_hashes: string[];
}

export interface Outputs {
    blob: string;
    block_header: BlockHeader;
    credits: number;
    json: BlockDetails;
    tx_hashes: string[];
    status: string;
    top_hash: string;
    untrusted: boolean;
}

