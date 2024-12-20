
export const method = '/get_limit'

export const description = 'Get daemon bandwidth limits.'

export interface Inputs {
    // None

}

export interface Outputs {
    limit_down: number;
    limit_up: number;
    status: string;
    untrusted: boolean;
}
