
export const method = 'flush_txpool'

export const url = `https://www.getmonero.org/resources/developer-guides/daemon-rpc.html#${method}`

export const description = 'Flush tx ids from transaction pool'

export interface Inputs {
    txis: string[];
}

export interface Outputs {
    status: string;
}