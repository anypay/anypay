
export const method = '/stop_mining'

export const description = 'Stop mining on the daemon.'

export interface Inputs {
    // None

}

export interface Outputs {
    status: string;
    untrusted: boolean;
}
