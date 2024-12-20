
export const url = 'https://monerodocs.org/interacting/monero-wallet-rpc-reference/#start_mining'

export const method = 'start_mining'

export const description = 'Start mining in the Monero daemon.'

export interface Inputs {
    threads_count: number; 
    do_background_mining: boolean;
    ignore_battery: boolean;
}

export interface Outputs {
    // None
}