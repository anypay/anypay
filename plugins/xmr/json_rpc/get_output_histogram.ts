
export const method = 'get_output_histogram'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get a histogram of output amounts. For all amounts (possibly filtered by parameters), gives the number of outputs on the chain for that amount. RingCT outputs counts as 0 amount.'


export interface Inputs {
    amounts: number[];
    min_count: number;
    max_count: number;
    unlocked: boolean;
    recent_cutoff: number;
}

interface Histogram {
    amount: number;
    total_instances: number;
    unlocked_instances: number;
    recent_instances: number;
}

export interface Outputs {
    credits: number;
    histogram: Histogram;
    status: string;
    top_hash: string;
    untrusted: boolean;
}