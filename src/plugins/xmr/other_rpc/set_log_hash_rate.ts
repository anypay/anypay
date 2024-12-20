
export const method = '/set_log_hash_rate'

export const description = 'Set the log hash rate display mode.'

export interface Inputs {
    // None
    visible: boolean;
}

export interface Outputs {
    status: string;
    untrusted: boolean;
}
