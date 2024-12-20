
export const method = '/start_mining'

export const description = 'Start mining on the daemon.'

export interface Inputs {
    do_background_mining: boolean;
    ignore_battery: boolean;
    miner_address: string;
    threads_count: number;
}

export interface Outputs {
    status: string;
    untrusted: boolean;
}
