
export const method = 'get_txpool_backlog'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get all transaction pool backlog'


export interface Inputs {
    // None
}

interface TxBacklogEntry {
    blob_size: number;
    fee: number;
    time_in_pool: number;
}

export interface Outputs {
    backlog: TxBacklogEntry[];
    status: string;
    untrusted: boolean;
}