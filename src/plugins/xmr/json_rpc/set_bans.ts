
export const method = 'set_bans'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Ban another node by IP.'

interface Ban {
    host: string;
    ip: number;
    ban: boolean;
    seconds: number;
}

export interface Inputs {
    bans: Ban[]
}

export interface Outputs {
    status: string;
}