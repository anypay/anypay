
export const method = '/update'

export const description = 'Update daemon.'

export interface Inputs {
    command: string;
    path?: string;
}

export interface Outputs {
    auto_uri: string;
    hash: string;
    path: string;
    status: string;
    untrusted: boolean;
    update: boolean;
    user_uri: string;
    version: string
}
