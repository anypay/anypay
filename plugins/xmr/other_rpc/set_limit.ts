
export const method = '/set_limit'

export const description = 'Set daemon bandwidth limits.'

export interface Inputs {
    limit_down: number;
    limit_up: number;
}

export interface Outputs {
    limit_down: number;
    limit_up: number;
    status: string;
    untrusted: boolean;
}
