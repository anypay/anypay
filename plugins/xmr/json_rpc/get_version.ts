
export const method = 'get_version'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Give the node current version'


export interface Inputs {
    // none
}

export interface Outputs {
    release: boolean;
    status: string;
    untrusted: boolean;
    version: number;
}