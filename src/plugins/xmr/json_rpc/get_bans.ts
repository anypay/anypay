
export const method = 'get_bans'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Get list of banned IPs.'

interface Ban {
    host: string;
    ip: number;
    ban: boolean;
    seconds: number;
}

export interface Inputs {
    // None
}

export interface Outputs {
    bans: Ban[];
    status: string;
    untrusted: boolean;
}