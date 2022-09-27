
export const method = '/set_log_level'

export const description = 'Set the daemon log level. By default, log level is set to 0.'

export interface Inputs {
    level: number;
}

export interface Outputs {
    status: string;
    untrusted: boolean;
}
