import { Connection } from "./get_connections";

export const method = 'sync_info'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get synchronisation informations'


export interface Inputs {
    // None
}

interface Span {
    connection_id: string;
    nblocks: number;
    rate: number;
    remote_address: string;
    size: number;
    speed: number;
    start_block_height: number;
}

interface Peer {
    info: Connection
}

export interface Outputs {
    credits: number;
    height: number;
    next_needed_pruning_seed: number;
    overview: string;
    peers: Peer[];
    spans: Span[];
    status: string;
    target_height: number;
}